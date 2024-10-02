import { Flex } from '@mantine/core'
import { MainScreen } from './screens/MainScreen'
import { SelectAccountScreen } from './screens/SelectAccount'
import { TodoListScreen } from './screens/TodoListScreen'
import { useRouter } from './use-router'

function nonexhaustiveSwitch(value: never): never {
  throw new Error(`Non-exhaustive switch case: ${value}`)
}

function App() {
  const { screen } = useRouter()

  let screenComponent
  switch (screen) {
    case 'select-account':
      screenComponent = <SelectAccountScreen />
      break
    case 'main':
      screenComponent = <MainScreen />
      break
    case 'todo-list':
      screenComponent = <TodoListScreen />
      break
    default:
      nonexhaustiveSwitch(screen)
  }

  return (
    <Flex p={'md'} px={'xl'} w={'100vw'} h={'100vh'} mah={'100vh'} align={'stretch'} justify={'stretch'}>
      {screenComponent}
    </Flex>
  )
}

export default App
