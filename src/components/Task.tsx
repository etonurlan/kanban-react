import { useSelector } from "react-redux"
import { useState } from "react"

import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"
import { TaskModal } from "../modals/TaskModal"

type Column = {
    id?: string;
    columnName?: string;
    tasks?: object[];
}
type Task = {
    taskName?: string;
    taskStatus?: boolean;
    taskDescription?: string;
    subtasks?: object[];
    newColIndex?: number;
}
type Subtask = {
    subtaskName?: string;
    isCompleted?: boolean;
}

export const Task = ({colIndex}: {colIndex: number}) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [taskIndex, setTaskIndex] = useState(0)

    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)
    const columns = board?.columns
    let col: Column | undefined = {}
    col = columns?.find((_col: Column, i) => i === colIndex)

    const onFetch = (index: number) => {
        setIsTaskModalOpen(true)
        setTaskIndex(index)
    }

    return (
        <div>
            {col!.tasks!.length > 0 && col?.tasks?.map((task: Task, index) => {
                let completed = 0
                let subtasks = task.subtasks
                subtasks?.forEach((subtask: Subtask) => {
                    if (subtask.isCompleted) {
                        completed++
                    }
                })

                return (
                    <div draggable
                         onDragStart={(event) => {
                            event.dataTransfer.setData(
                                "text",
                                JSON.stringify({ taskIndex: index, prevColIndex: colIndex })
                            )
                         }}
                         className="my-5 w-[280px] rounded-lg bg-white shadow-[#364e7e1a]
                                py-6 px-3 shadow-lg hover:text-[#635fc7] cursor-pointer
                                dark:bg-[#2b2c37] dark:text-white"
                         onClick={() => onFetch(index)}>
                        <p className="font-bold tracking-wide">
                            {task.taskName}
                        </p>
                        <p className="font-bold text-xs tracking-tighter mt-2 text-gray-500">
                            {completed} of {task?.subtasks?.length} completed tasks
                        </p>
                    </div>
                )
            })}
            {isTaskModalOpen && (
                <TaskModal setIsTaskModalOpen={setIsTaskModalOpen} colIndex={colIndex} taskIndex={taskIndex} />
            )}
        </div>
    )
}