import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"

import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"
import { AddEditBoardModal } from "../modals/AddEditBoardModal"
import { Task } from "./Task"
import { dragTask } from "../store/features/boardSlice"

type Column = {
    id?: string;
    columnName?: string;
    tasks?: object[];
}

export const Board = () => {
    const dispatch = useDispatch()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-indigo-500",
        "bg-yellow-500",
        "bg-pink-500",
        "bg-sky-500",
    ]
    var color = colors[Math.floor(Math.random()*colors.length)]
    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)

    return (
        <div className="bg-[#f4f7fd] h-screen flex overflow-y-hidden
                        gap-6 dark:bg-[#20212c]">
            {boards?.length > 0 && board?.columns?.map((column: Column, index) => (
                <div className="mx-5 pt-[10px] min-w-[280px]"
                     onDrop={(event) => {
                        const { prevColIndex, taskIndex } = JSON.parse(
                            event.dataTransfer.getData("text")
                        )

                        if (index !== prevColIndex) {
                            dispatch(dragTask({ index, prevColIndex, taskIndex }))
                        }
                     }}
                     onDragOver={(event) => {
                        event.preventDefault()
                     }}>
                    <p className="font-semibold flex items-center gap-2
                                tracking-widest text-[#828fa3]">
                        <div className={`rounded-full w-4 h-4 ${color}`}></div>
                        {column.columnName}
                    </p>
                    <Task colIndex={index} />
                </div>
            ))}
            <div className="h-screen flex justify-center items-center
                            font-bold text-2xl hover:text-[#635FC7]
                            dark:bg-[#2b2c3740]
                            transition duration-300 cursor-pointer
                            bg-[#E9EFFA] my-2 mx-5 pt-[10px]
                            min-w-[280px] text-[#828FA3] rounded-lg"
                 onClick={() => setIsEditModalOpen(true)}>
                + New Column
            </div>
            {isEditModalOpen && (
                <AddEditBoardModal setIsBoardModalOpen={setIsEditModalOpen} type="edit" />
            )}
        </div>
    )
}