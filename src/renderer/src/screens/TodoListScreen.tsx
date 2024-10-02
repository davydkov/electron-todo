import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CopyButton,
  Group,
  type MantineColor,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Portal,
  rem,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NewItemForm } from '@renderer/components/NewItemForm'
import { UserAvatar as HeaderUserAvatar } from '@renderer/components/UserAvatar'
import type { Todo, TodoState, UserId } from '@renderer/data/_types'
import { addToDo, changeTodoState, useTodoList } from '@renderer/data/todos'
import { useUser } from '@renderer/data/user'
import { isValidStateTransition } from '@renderer/data/validation'
import { useRouter } from '@renderer/use-router'
import { IconArrowLeft, IconCheck, IconCopy } from '@tabler/icons-react'
import { useState } from 'react'
import { groupBy, pipe, prop, values } from 'remeda'
import styles from './TodoListScreen.module.css'

export function TodoListScreen() {
  const { goToMainScreen } = useRouter()
  const { id, store } = useTodoList()

  const [activeDraggingTodoId, setActiveDraggable] = useState<string | null>(null)

  const {
    TODO = [],
    ONGOING = [],
    DONE = []
  } = pipe(
    values(store.todos),
    groupBy(prop('state'))
  )

  const activeDraggingTodo = activeDraggingTodoId ? store.todos[activeDraggingTodoId] : null

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragStart={e => setActiveDraggable(e.active.id as string)}
      onDragEnd={({ over }) => {
        const toState = over?.data.current?.state as (TodoState | undefined)
        if (activeDraggingTodo && toState) {
          changeTodoState(activeDraggingTodo.id, toState)
        }
        setActiveDraggable(null)
      }}
      cancelDrop={({ active, over }) =>
        !active.data.current?.state || !over?.data.current?.state
        || !isValidStateTransition(active.data.current.state, over.data.current.state)}
    >
      <Stack gap={'md'} flex={1}>
        <Group flex={0} justify="space-between">
          <Group>
            <ActionIcon
              color="gray"
              variant="subtle"
              onClick={goToMainScreen}
            >
              <IconArrowLeft size={'70%'} />
            </ActionIcon>
            <Title order={3}>{store.meta.name || 'Untitled'}</Title>
            <Text size="sm" c="dimmed">{id}</Text>
            <CopyButton value={id} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon
                    color={copied ? 'teal' : 'gray'}
                    variant="subtle"
                    onClick={e => {
                      e.stopPropagation()
                      copy()
                    }}>
                    {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <HeaderUserAvatar />
        </Group>
        <Group grow gap={'lg'} flex={1} align="stretch" style={{ overflow: 'hidden', position: 'relative' }}>
          <StateColumn state="TODO" todos={TODO} />
          <StateColumn state="ONGOING" todos={ONGOING} />
          <StateColumn state="DONE" todos={DONE} />
        </Group>
      </Stack>
      <Portal>
        <DragOverlay>
          {activeDraggingTodo && <ToDoCard todo={activeDraggingTodo} />}
        </DragOverlay>
      </Portal>
    </DndContext>
  )
}

type StateColumnProps = {
  state: Todo['state']
  todos: Todo[]
}

const StateColumn = ({
  state,
  todos
}: StateColumnProps) => {
  const {
    isOver,
    active,
    setNodeRef
  } = useDroppable({
    id: state,
    data: {
      state
    }
  })

  let bgColor: MantineColor = 'dark'
  if (isOver) {
    bgColor = isValidStateTransition(active?.data.current?.state ?? state, state)
      ? 'dark.5'
      : 'var(--mantine-color-pink-light)'
  }

  return (
    <ScrollArea ref={setNodeRef} h={'100%'} bg={bgColor} scrollbars="y">
      <Stack p={'md'}>
        {todos.map(todo => <DraggableToDo key={todo.id} todo={todo} />)}
        {state === 'TODO' && <AddToDo />}
      </Stack>
    </ScrollArea>
  )
}

const DraggableToDo = ({ todo }: { todo: Todo }) => {
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef
  } = useDraggable({
    id: todo.id,
    data: { state: todo.state }
  })

  return (
    <Box ref={setNodeRef} style={{ visibility: isDragging ? 'hidden' : 'visible' }} {...listeners} {...attributes}>
      <ToDoCard todo={todo} />
    </Box>
  )
}

const UserAvatar = ({userId}: {userId: UserId}) => {
  const user = useUser(userId)
  return <Avatar src={user.avatar} name={user.name} color="initials" size={18} />
}

const ToDoCard = ({ todo }: { todo: Todo }) => {
  const lastUser = useUser(todo.lastModified?.userId ?? todo.createdBy)

  let avatars
  if (todo.lastModified?.userId) {
    avatars = <AvatarGroup>
      <UserAvatar userId={todo.createdBy}/>
      <UserAvatar userId={todo.lastModified.userId}/>
    </AvatarGroup>
  } else {
    avatars = <UserAvatar userId={todo.createdBy}/>
  }

  let tooltip = `Created at ${new Date(todo.createdAt).toLocaleString()}`
  if (todo.lastModified?.timestamp) {
    tooltip += `\nLast modified at ${new Date(todo.lastModified?.timestamp).toLocaleString()}`
  }

  return (
    <Card
      className={styles.todoCard}
      component={Stack}
      align="stretch"
      p="sm"
      gap={'xs'}>
      <Text component="div" fz={'sm'}>{todo.title}</Text>
      <Group justify="space-between">
        <Tooltip label={tooltip} multiline>
          <Button
            color="gray"
            size="compact-xs"
            variant="subtle"
            pl={0}
            leftSection={avatars}
            c="dimmed"
          >
            {lastUser.name}
          </Button>
        </Tooltip>
      </Group>
    </Card>
  )
}

function AddToDo() {
  const [index, setIndex] = useState(1)
  const [isOpened, { toggle, close }] = useDisclosure()

  return (
    <Popover
      opened={isOpened}
      keepMounted={false}
      onClose={close}
      trapFocus
      width={'target'}
      position="bottom"
      shadow="lg">
      <PopoverTarget>
        <Button fullWidth variant="light" onClick={toggle}>
          + Add Todo
        </Button>
      </PopoverTarget>
      <PopoverDropdown p={'sm'} miw={200}>
        <NewItemForm
          initialValue={`New Todo ${index}`}
          onSubmit={title => {
            addToDo(title)
            setIndex(v => v + 1)
            close()
          }}
        />
      </PopoverDropdown>
    </Popover>
  )
}

// function SyncStatus() {
//   const isSynced = useIsCurrentListSynced()
//   return (
//     <Box p={'sm'}>
//       {/* {isSynced && <Badge size='xs' radius={'xs'} color="green">Synced</Badge>} */}
//       {!isSynced && <Badge size='xs' radius={'xs'} color="pink">Not Synced</Badge>}
//     </Box>
//   )
// }
