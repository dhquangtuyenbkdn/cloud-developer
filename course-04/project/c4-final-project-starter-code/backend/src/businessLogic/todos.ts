import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'

import { parseUserId } from '../auth/utils'

const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllTodos(): Promise<TodoItem[]> {
    return todoAccess.getAllTodos()
}

export async function getTodosForUser(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return await todoAccess.getTodosForUser(userId)
}


export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {

    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken)

    return await todoAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        done: false,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString()
    });
}


export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
): Promise<TodoUpdate> {
    return await todoAccess.updateTodo(todoId,
        {
            name: updateTodoRequest.name,
            done: updateTodoRequest.done,
            dueDate: updateTodoRequest.dueDate
        });
}

export async function deleteTodo(
    todoId: string,
    jwtToken: string
): Promise<string> {

    //const itemId = uuid.v4();
    const userId = parseUserId(jwtToken)

    return await todoAccess.deleteTodo(userId, todoId);
}

export function createAttachmentPresignedUrl(todoId: string): string {
    return attachmentUtils.createAttachmentPresignedUrl(todoId);
}
