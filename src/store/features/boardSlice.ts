import { createSlice } from "@reduxjs/toolkit";

import data from "../../data.json"

export interface BoardsState {
    boards: object[],
}
export interface ColumnsState {
    columns: object[]
}

export type BoardState = {
    name?: string
    isActive?: boolean
    columns?: object[]
}
export type ColumnState = {
    name?: string
    tasks?: object[]
}
export type TaskState = {
    taskName?: string;
    taskStatus?: string;
    taskDescription?: string;
    subtasks?: object[];
    newColIndex?: number;
}
export type Subtask = {
    subtaskName?: string;
    isCompleted?: boolean;
}

export const boardSlice = createSlice({
    name: 'boards',
    initialState: data.boards,
    reducers: {
        addBoard: (state, action) => {
            const isActive = state.boards.length > 0 ? false : true
            const payload = action.payload
            const board = {
                name: payload.boardName,
                isActive,
                columns: []
            }
            board.columns = payload.columns
            state.boards.push(board)
        },
        setBoardActive: (state, action) => {
            state.boards.map((board: BoardState, index) => {
                index === action.payload.index
                    ? (board.isActive = true)
                    : (board.isActive = false)
                return board
            })
        },
        deleteBoard: (state) => {
            const board = state.boards.find((board: BoardState) => board.isActive)!
            state.boards.splice(state.boards.indexOf(board), 1)
        },
        editBoard: (state, action) => {
            const payload = action.payload
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            board.name = payload.boardName
            board.columns = payload.columns
        },
        addTask: (state, action) => {
            const { taskName, taskStatus, taskDescription, subtasks, newColIndex } = action.payload
            const task = { taskName, taskDescription, subtasks, taskStatus }
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            const column: ColumnState | undefined = board.columns?.find((_col, index) => index === newColIndex)
            column?.tasks?.push(task)
        },
        editTask: (state, action) => {
            const { taskName, taskStatus, taskDescription, subtasks,
                    prevColIndex, newColIndex, taskIndex } = action.payload
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            const column: ColumnState | undefined = board.columns?.find((_col, index) => index === prevColIndex)
            const task: TaskState | undefined = column?.tasks?.find((_task, index) => index === taskIndex)
            task!.taskName = taskName
            task!.taskStatus = taskStatus
            task!.taskDescription = taskDescription
            task!.subtasks = subtasks
            if (prevColIndex === newColIndex) return;
            column!.tasks = column?.tasks?.filter((_task, index) => index !== taskIndex)
            const newCol: ColumnState | undefined = board.columns?.find((_col, index) => index === newColIndex)
            newCol?.tasks?.push(task!)
        },
        setSubtaskCompleted: (state, action) => {
            const payload = action.payload
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            const column: ColumnState | undefined = board.columns?.find((_col, index) => index === payload.colIndex)
            const task: TaskState | undefined = column?.tasks?.find((_task, index) => index === payload.taskIndex)
            const subtask: Subtask | undefined = task?.subtasks?.find((_subtask, index) => index === payload.index)
            subtask!.isCompleted = !subtask?.isCompleted
        },
        setTaskStatus: (state, action) => {
            const payload = action.payload
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            const columns = board.columns
            const column: ColumnState | undefined = board.columns?.find((_col, index) => index === payload.colIndex)
            if (payload.colIndex === payload.newColIndex) return;
            const task: TaskState | undefined = column?.tasks?.find((_task, index) => index === payload.taskIndex)
            task!.taskStatus = payload.taskStatus
            column!.tasks = column?.tasks?.filter((_task, i) => i !== payload.taskIndex)
            const newCol: ColumnState | undefined = columns?.find((_col, i) => i === payload.newColIndex)
            newCol?.tasks?.push(task!)
        },
        deleteTask: (state, action) => {
            const payload = action.payload
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            const column: ColumnState | undefined = board.columns?.find((_col, index) => index === payload.colIndex)
            column!.tasks = column?.tasks?.filter((_task, i) => i !== payload.taskIndex)
        },
        dragTask: (state, action) => {
            const { index: colIndex, prevColIndex, taskIndex } = action.payload
            const board: BoardState = state.boards.find((board: BoardState) => board.isActive)!
            const prevCol: ColumnState = board.columns?.find((_col, i) => i === prevColIndex)!
            const col: ColumnState = board.columns?.find((_col, i) => i === colIndex)!
            const task: TaskState = prevCol.tasks?.splice(taskIndex, 1)[0]!
            col.tasks!.push(task)  
        }
    },
})

export const { addBoard, setBoardActive, deleteBoard, editBoard, addTask,
               editTask, setSubtaskCompleted, setTaskStatus, deleteTask,
               dragTask } = boardSlice.actions

export default boardSlice.reducer