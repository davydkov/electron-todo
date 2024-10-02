import { TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { isTruthy } from 'remeda'

interface NewItemFormProps {
  initialValue?: string
  placeholder?: string
  onSubmit: (item: string) => void
}

export function NewItemForm({
  initialValue,
  placeholder = initialValue || 'New Item',
  onSubmit
}: NewItemFormProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: initialValue || ''
    },
    validate: {
      title: value => {
        if (!isTruthy(value)) {
          return 'Empty'
        }
        return undefined
      }
    }
  })

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values.title))}>
      <TextInput
        label=""
        placeholder={placeholder}
        size="sm"
        w={'100%'}
        description="Press Enter to continue"
        inputWrapperOrder={['label', 'error', 'input', 'description']}
        key={form.key('title')}
        {...form.getInputProps('title')}
      />
    </form>
  )
}
