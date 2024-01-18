import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"

import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"
import { addTask, editTask } from "../store/features/boardSlice"
import { v4 as uuidv4 } from "uuid"

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
    id?: string;
    subtaskName?: string;
    isCompleted?: boolean;
}

export const AddEditTaskModal = ({ setIsTaskModalOpen, type,
     taskIndex, prevColIndex = 0 } : 
    { setIsTaskModalOpen: Function, type: string,
         taskIndex: number, prevColIndex: number }) => {
    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)
    const columns = board?.columns
    const col: Column | undefined = columns?.find((_col, index) => index === prevColIndex)
    const task: Task | undefined = col ? col.tasks?.find((_task, index) => index === taskIndex) : []
    
    const dispatch = useDispatch()
    
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskStatus, setTaskStatus] = useState('')
    const [newColIndex, setNewColIndex] = useState(0)

    const [subtasks, setSubtasks] = useState<Subtask[]>([])
    const changeSubtaskName = (id: string, newValue: string) => {
        setSubtasks((prevState) => {
            const newState = [...prevState]
            const subtask: Subtask = newState.find((subtask: Subtask) => subtask.id === id)!
            subtask.subtaskName = newValue
            return newState
        })
    }
    const deleteSubtask = (id: string) => {
        setSubtasks((prevState) => prevState.filter((el: Subtask) => el.id !== id))
    }

    if (type === "edit" && isFirstLoad) {
        setSubtasks(
            task?.subtasks?.map((subtask) => {
                return { ...subtask, id: uuidv4() }
            })!
        )
        setTaskName(task?.taskName!)
        setTaskDescription(task?.taskDescription!)
        setIsFirstLoad(false)
    }

    const onSubmit = (type: string) => {
        if (type === 'add') {
            dispatch(addTask({ taskName, taskDescription, taskStatus, subtasks, newColIndex, }))
        }
        else {
            dispatch(editTask({ taskName, taskDescription, subtasks, taskStatus,
                                taskIndex, prevColIndex, newColIndex }))
        }
    }

    return (
        <div className="fixed right-0 top-0 px-2 py-4 bg-[#00000080]
                        z-50 left-0 bottom-0 justify-center
                        items-center flex overflow-y-scroll">
            <div className="min-h-[95vh] bg-white dark:bg-[#2b2c37] dark:text-white
                            text-black font-bold shadow-md shadow-[#364e7e1a]
                            max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl">
                <div className="flex items-center">
                    <h3 className="text-lg mr-auto">
                        {type === "edit" ? "Edit" : "Add New"} Task
                    </h3>
                    <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-cross.d4ca9e0d2a82f7ea4ae08238a42f84ed.svg"
                        alt="Close"
                        className="m-4 cursor-pointer"
                        onClick={() => setIsTaskModalOpen(false)} />
                </div>
                <div className="mt-8 flex flex-col space-y-1">
                    <h4 className="text-sm text-gray-500 dark:text-white">Task Name</h4>
                    <input className="bg-transparent px-4 py-2 rounded-md text-sm
                                      border-[0.5px] border-gray-600
                                      focus:outline-[#635fc7] outline-1 ring-0"
                            value={taskName}
                           type="text" placeholder="e.g Take coffee break"
                           onChange={(event) => setTaskName(event.target.value)} />
                </div>
                <div className="mt-8 flex flex-col space-y-1">
                    <h4 className="text-sm text-gray-500 dark:text-white">Description</h4>
                    <textarea id="task-description-input"
                              className="bg-transparent outline-none min-h-[200px]
                                        focus:border-0 px-4 py-2 rounded-md
                                        text-sm border-[0.5px] border-gray-600
                                        focus:outline-[#635fc7] outline-[1px]"
                              value={taskDescription}
                              placeholder="e.g It`s always good to take a break. This 15 minute break will recharge the batteries a little."
                              onChange={(event) => setTaskDescription(event.target.value)}>
                    </textarea>
                </div>
                <div className="mt-8 flex flex-col space-y-3">
                    <h4 className="text-sm text-gray-500 dark:text-white">Subtasks</h4>
                    {subtasks.length > 0 && subtasks.map((subtask: Subtask) => (
                        <div className="flex items-center w-full">
                            <input  className="bg-transparent flex-grow px-4 py-2
                                                rounded-md text-sm border-[0.5px]
                                            border-gray-600 focus:outline-[#635fc7]
                                                outline-[1px]"
                                    type="text" placeholder="e.g Take coffee break"
                                    value={subtask.subtaskName}
                                    onChange={(event) => {
                                        changeSubtaskName(subtask.id!, event.target.value)
                                    }} />
                            <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-cross.d4ca9e0d2a82f7ea4ae08238a42f84ed.svg"
                                    alt="Delete"
                                    className="m-4 cursor-pointer"
                                    onClick={() => deleteSubtask(subtask.id!)}/>
                        </div>
                    ))}
                    <button className="w-full items-center hover:opacity-70 text-white
                                        bg-[#635fc7] py-2 rounded-full
                                        dark:text-[#635fc7] dark:bg-white"
                            onClick={() => {
                                setSubtasks((state) => [
                                    ...state,
                                    { subtaskName: "", isCompleted: false, id: uuidv4() },
                                ])
                            }}>
                        + Add New Subtask
                    </button>
                </div>
                <div className="mt-8 flex flex-col space-y-3">
                    <h4 className="text-sm text-gray-500 dark:text-white">Current Status</h4>
                    <select title="status"
                            value={taskStatus}
                            onChange={(event) => {
                                setTaskStatus(event.target.value)
                                setNewColIndex(event.target.selectedIndex)
                            }}
                            className="flex-grow px-4 py-2 rounded-md text-sm
                                       bg-transparent focus:border-0 border-[1px]
                                       border-gray-300 focus:outline-[#635fc7]
                                       outline-none">
                        {board!.columns!.length > 0 && board?.columns?.map((column: Column) => (
                            <option>{column.columnName}</option>
                        ))}
                    </select>
                    <button className="w-full items-center hover:opacity-70 text-white
                                     bg-[#635fc7] py-2 rounded-full mt-8"
                            onClick={() => onSubmit(type)}>
                        {type === 'edit' ? 'Save' : 'Create'} Task
                    </button>
                </div>
            </div>
        </div>
    )
}