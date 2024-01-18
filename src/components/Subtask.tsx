import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"
import { setSubtaskCompleted } from "../store/features/boardSlice"

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

export const Subtask = ({index, taskIndex, colIndex}: {index: number, taskIndex: number, colIndex: number}) => {
    const dispatch = useDispatch()
    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)
    const columns = board?.columns
    let col: Column | undefined = {}
    col = columns?.find((_col: Column, i) => i === colIndex)
    let task: Task | undefined = {}
    task = col?.tasks?.find((_task: Task, i) => i === taskIndex)
    let subtask: Subtask | undefined = {}
    subtask = task?.subtasks?.find((_subtask: Subtask, i) => i === index)
    const checked = subtask?.isCompleted

    const onChange = (_event: any) => {
        dispatch(
            setSubtaskCompleted({ index, taskIndex, colIndex })
        )
    }

    return (
        <div className="w-full flex hover:bg-[#635fc740] rounded-md
                        relative items-center justify-start p-3 gap-4
                        bg-[#f4f7fd] dark:bg-[#20212c]">
            <input type="checkbox"
                   className="w-4 h-4 accent-[#635fc7] cursor-pointer"
                   placeholder="subtask"
                   checked={checked}
                   onChange={onChange} />
            <p className={`${checked} && "line-through opacity-30"`}>
                {subtask?.subtaskName}
            </p>
        </div>
    )
}