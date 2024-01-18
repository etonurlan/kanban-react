import { useSelector } from "react-redux"
import { useState } from "react"

import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"
import { DeleteModals } from "../modals/DeleteModals"
import { AddEditBoardModal } from "../modals/AddEditBoardModal"
import { AddEditTaskModal } from "../modals/AddEditTaskModal"

export const Header = () => {
    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)
    const [showDropdown, setShowDropdown] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    const onDeleteBtnClick = () => {

    }

    return (
        <header className="flex p-4 items-center dark:bg-[#2b2c37]">
            <div className="flex items-center mr-[120px]">
                <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/logo-mobile.e60c2fbc3dcefa4256e0569ffba5e523.svg"
                     alt="Logo"
                     className="h-6 w-6 mr-3" />
                <h1 className="text-black font-bold text-[35px] dark:text-white">kanban</h1>
            </div>
            <h2 className="text-black font-semibold text-[22px] mr-auto dark:text-white">
                {board?.name}
            </h2>
            <div className="flex items-center">
                <button className="text-white font-medium text-[18px] bg-[rgb(99,95,199)]
                        py-[0.5rem] px-[1rem] rounded-3xl mr-5"
                        onClick={() => setIsTaskModalOpen(true)}>
                    + Add New Task
                </button>
                <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-vertical-ellipsis.5c8996197d4a9dd7a7adfa20ce4abef9.svg"
                     alt="Settings"
                     className="h-6 w-[6px] cursor-pointer"
                     onClick={() => setShowDropdown(!showDropdown)} />
                {showDropdown && (
                    <div className="absolute top-16 right-5">
                        <div className="flex justify-end items-center">
                            <div className="w-40 text-sm z-50 font-medium
                                            shadow-md shadow-[#364e7e1a]
                                            bg-white space-y-4 py-5 px-4
                                            rounded-lg h-auto pr-12
                                            dark:bg-[#20212c]">
                                <p className="cursor-pointer text-gray-700 dark:text-gray-400"
                                   onClick={() => setIsEditModalOpen(true)}>
                                    Edit Boards
                                </p>
                                <p className="cursor-pointer text-red-500"
                                   onClick={() => setIsDeleteModalOpen(true)}>
                                    Delete Boards
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isDeleteModalOpen && (
                <DeleteModals type="board" title={board?.name}
                onDeleteBtnClick={onDeleteBtnClick}
                setIsDeleteModalOpen={setIsDeleteModalOpen} />
            )}
            {isEditModalOpen && (
                <AddEditBoardModal setIsBoardModalOpen={setIsEditModalOpen} type="edit" />
            )}
            {isTaskModalOpen && (
                <AddEditTaskModal type="add" setIsTaskModalOpen={setIsTaskModalOpen}
                                  taskIndex={0} prevColIndex={0} />
            )}
        </header>
    )
}