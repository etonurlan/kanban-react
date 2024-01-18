import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"

import type { RootState } from "../store/store"
import { BoardState, deleteTask } from "../store/features/boardSlice"
import { Subtask } from "../components/Subtask"
import { setTaskStatus } from "../store/features/boardSlice"
import { DeleteModals } from "./DeleteModals"
import { AddEditTaskModal } from "./AddEditTaskModal"

type Column = {
    id?: string;
    columnName?: string;
    tasks?: object[];
}
type Task = {
    taskName?: string;
    taskStatus?: string;
    taskDescription?: string;
    subtasks?: object[];
    newColIndex?: number;
}
type Subtask = {
    subtaskName?: string;
    isCompleted?: boolean;
}

export const TaskModal = ({setIsTaskModalOpen, taskIndex, colIndex}: {setIsTaskModalOpen: Function, taskIndex: number, colIndex: number}) => {
    const dispatch = useDispatch()
    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)
    const columns = board?.columns
    let col: Column | undefined = {}
    col = columns?.find((_col: Column, i) => i === colIndex)
    let task: Task | undefined = {}
    task = col?.tasks?.find((_task: Task, i) => i === taskIndex)
    const subtasks = task?.subtasks
    const [status, setStatus] = useState(task?.taskStatus)
    const [newColIndex, setNewColIndex] = useState(columns?.indexOf(col!))

    const [showDropdown, setShowDropdown] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    let completed = 0
    subtasks?.forEach((subtask: Subtask) => {
        if (subtask.isCompleted) {
            completed++
        }
    })

    const onChange = (event: any) => {
        setStatus(event.target.value)
        setNewColIndex(event.target.selectedIndex)
    }

    const onClose = (event: any) => {
        if (event.target !== event.currentTarget) {
            return
        }
        dispatch(
            setTaskStatus({
                taskIndex,
                colIndex,
                newColIndex,
                status
            })
        )
        setIsTaskModalOpen(false)
    }

    const onDeleteBtnClick = (event: any) => {
        if (event.target.textContent === "Delete") {
            dispatch(deleteTask({ taskIndex, colIndex }))
            setIsTaskModalOpen(false)
            setIsDeleteModalOpen(false)
        } else {
            setIsDeleteModalOpen(false)
        }
    }

    return (
        <div className="fixed right-0 top-0 px-2 py-4 z-50 left-0 bg-[#00000080]
                        bottom-0 justify-center items-center flex">
            <div className="max-h-[95vh] my-auto bg-white text-black
                            font-bold shadow-md shadow-[#364e7e1a] max-w-md
                            mx-auto w-full px-8 py-8 rounded-xl
                            dark:bg-[#2b2c37] dark:text-white">
                <div className="relative flex justify-between w-full items-center">
                    <h1 className="text-lg">
                        {task?.taskName}
                    </h1>
                    <div className="flex items-center">
                        <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-vertical-ellipsis.5c8996197d4a9dd7a7adfa20ce4abef9.svg"
                             alt="Settings"
                             className="cursor-pointer h-6"
                             onClick={() => setShowDropdown(!showDropdown)} />
                        <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-cross.d4ca9e0d2a82f7ea4ae08238a42f84ed.svg"
                             alt="Close"
                             className="m-4 cursor-pointer"
                             onClick={onClose} />
                        {showDropdown && (
                            <div className="absolute top-12 right-5">
                                <div className="flex justify-end items-center">
                                    <div className="w-40 text-sm z-50 font-medium
                                                    shadow-md shadow-[#364e7e1a]
                                                    bg-white space-y-4 py-5 px-4
                                                    rounded-lg h-auto pr-12
                                                    dark:bg-[#20212c]">
                                        <p className="cursor-pointer text-gray-700 dark:text-gray-400"
                                        onClick={() => setIsEditModalOpen(true)}>
                                            Edit Task
                                        </p>
                                        <p className="cursor-pointer text-red-500"
                                        onClick={() => setIsDeleteModalOpen(true)}>
                                            Delete Task
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
                    {task?.taskDescription}
                </p>
                <p className="pt-6 text-gray-500 tracking-widest text-sm">
                    Subtasks ({completed} of {subtasks?.length})
                </p>
                <div className="mt-3 space-y-2">
                    {subtasks?.map((_subtask: Subtask, index) => (
                        <Subtask index={index} taskIndex={taskIndex} colIndex={colIndex}
                                 key={index} />
                    ))}
                </div>
                <div className="mt-8 flex flex-col space-y-3">
                    <label className="text-sm text-gray-500 dark:text-white">
                        Current Status
                    </label>
                    <select title="status"
                            className="flex-grow px-4 py-2 rounded-md text-sm
                                       bg-transparent focus:border-0 border-[1px]
                                       border-gray-300 focus:outline-[#635fc7]
                                       outline-none"
                            value={status}
                            onChange={onChange}>
                        {columns?.map((col: Column, index) => (
                            <option key={index}>
                                {col?.columnName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {isDeleteModalOpen && (
                <DeleteModals type="task" title={task?.taskName}
                onDeleteBtnClick={onDeleteBtnClick}
                setIsDeleteModalOpen={setIsDeleteModalOpen} />
            )}
            {isEditModalOpen && (
                <AddEditTaskModal
                    setIsTaskModalOpen={setIsTaskModalOpen}
                    type="edit"
                    taskIndex={taskIndex}
                    prevColIndex={colIndex}
                />
            )}
        </div>
    )
}