'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const isAllDay = formData.get('isAllDay') === 'on'
    const recurrence = formData.get('recurrence') as string
    const listType = formData.get('listType') as string

    const { error } = await supabase.from('tasks').insert({
        title,
        description,
        due_date: date || null,
        due_time: time || null,
        is_all_day: isAllDay,
        recurrence,
        list_type: listType,
        user_id: user.id,
        is_starred: false
    })

    if (error) return { error: error.message }

    revalidatePath('/')
    return { success: true }
}

export async function toggleTaskStar(taskId: string, isStarred: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('tasks')
        .update({ is_starred: !isStarred })
        .eq('id', taskId)

    if (error) return { error: error.message }

    revalidatePath('/')
}

export async function toggleTaskCompletion(taskId: string, isCompleted: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('tasks')
        .update({ is_completed: isCompleted })
        .eq('id', taskId)

    if (error) return { error: error.message }
    revalidatePath('/')
}

export async function deleteTask(taskId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

    if (error) return { error: error.message }
    revalidatePath('/')
}
