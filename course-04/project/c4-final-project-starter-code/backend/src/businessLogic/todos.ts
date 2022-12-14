import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { S3EventRecord } from 'aws-lambda'
import Jimp from 'jimp/es'
import { createLogger } from '../utils/logger'
const logger = createLogger("Business Logic");

const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

const imageBucketName = process.env.ATTACHMENT_S3_BUCKET;
const thumbnailsBucketName = process.env.THUMBNAILS_S3_BUCKET;

export async function getAllTodos(): Promise<TodoItem[]> {
    return todoAccess.getAllTodos()
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodosForUser(userId)
}


export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string): Promise<TodoItem> {
    const itemId = uuid.v4();
    logger.info('Create todo for: ', userId)
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
    userId: string,
    updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {
    logger.info('update todo for: ', userId)

    return await todoAccess.updateTodo(todoId, userId, updateTodoRequest);
}

export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<string> {
    logger.info('delete todo for: ', userId)
    attachmentUtils.deleteAttachment(imageBucketName, userId, todoId);
    attachmentUtils.deleteAttachment(thumbnailsBucketName, userId, todoId);

    return await todoAccess.deleteTodo(todoId, userId);
}

export function createAttachmentPresignedUrl(todoId: string, userId: string): string {
    logger.info('create Attachment PresignedUrl for: ', userId, todoId)
    const attachmentPresignedUrl = attachmentUtils.createAttachmentPresignedUrl(imageBucketName, userId, todoId);
    //const attachmentUrl = attachmentUtils.getAttachmentUrl(imageBucketName, userId, todoId);

    //todoAccess.updateattachmentUrl(todoId, userId, attachmentUrl);

    return attachmentPresignedUrl;
}


export async function processImage(record: S3EventRecord) {
    const key = record.s3.object.key
    const s3Key = decodeURIComponent(key)
    const params = s3Key.split('/');
    const userId = params[0];
    const todoId = params[1];
    console.log('Processing S3 item with key: ', key)
    console.log('Processing S3 item with todo: ', userId, todoId)

    console.log('Download image attacment from: ', imageBucketName)
    console.log('Decode image key: ', s3Key)
    const response = await attachmentUtils.getObject(imageBucketName, s3Key);

    console.log('Prepare for Resize image')
    const body = response.Body
    const image = await Jimp.read(body)

    console.log('Resizing image')
    image.resize(150, Jimp.AUTO)
    const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)

    if(convertedBuffer) {
        console.log('Upload image attacment to: ', thumbnailsBucketName)

        const attachmentUrl = await attachmentUtils.putObjectAttachmentWithKey(thumbnailsBucketName, s3Key, convertedBuffer);
    
        console.log('Update todo attachment Url: ', attachmentUrl)
        await todoAccess.updateattachmentUrl(todoId, userId, attachmentUrl);
    }
    else {
        console.error('Convert buffer error')
    }
}