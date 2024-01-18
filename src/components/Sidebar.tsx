import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Switch } from "@headlessui/react"

import { AddEditBoardModal } from "../modals/AddEditBoardModal"
import { setBoardActive } from "../store/features/boardSlice"
import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"
import useDarkMode from "../hooks/useDarkMode"

export const Sidebar = () => {
    const dispatch = useDispatch()
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
    const boards = useSelector((state: RootState) => state.boards.boards)

    const [colorTheme, setTheme] = useDarkMode()
    const [darkSide, setDarkSide] = useState(
        colorTheme === "light" ? true : false
    )
    const toggleDarkMode = (checked: boolean) => {
        setTheme(colorTheme)
        setDarkSide(checked)
    }

    return (
        <div className="h-[90vh] pt-4 min-w-[250px] dark:bg-[#2b2c37]">
           <p className="mb-8 text-gray-600 pl-5 font-medium dark:text-gray-300">
                ALL BOARDS <span>({boards?.length})</span>
            </p>
            <div className="mr-[20px]">
                {boards?.length > 0 && boards.map((board: BoardState, index) => (
                    <div className={`flex py-4 px-5 items-center
                                    cursor-pointer rounded-r-full hover:bg-[#635fc71a]
                                    duration-500 ease-in-out hover:text-[rgb(99,95,199)]
                                    dark:hover:bg-white dark:text-white
                                    ${board.isActive && "bg-[rgb(99,95,199)] text-white"}`}
                         onClick={() => dispatch(setBoardActive({index}))}>
                        <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-board.29b48f5174742b4dd3a04f52d710293c.svg"
                            alt="Board Logo"
                            className="h-4 w-4 mr-3" />
                        <h3 className="font-semibold text-[19px]">
                            {board.name}
                        </h3>
                    </div>
                ))}
                <div onClick={() => setIsBoardModalOpen(true)} 
                     className="flex py-4 px-5 items-center
                                cursor-pointer rounded-r-full hover:bg-[#635fc71a]
                                duration-500 ease-in-out dark:hover:bg-white">
                    <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-board.29b48f5174742b4dd3a04f52d710293c.svg"
                         alt="Board Logo"
                         className="h-4 w-4 mr-3" />
                    <h3 className="font-semibold text-[19px] text-[rgb(99,95,199)]">
                        Create New Board
                    </h3>
                </div>
                <div className="mx-2 p-4 relative space-x-2 bg-slate-100 dark:bg-[#20212c]
                                flex justify-center items-center rounded-lg">
                    <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-light-theme.b98efecd506358014a7ae1eadb34e36c.svg"
                         alt="light-icon" />
                    <Switch checked={darkSide}
                            onChange={toggleDarkMode}
                            className={`${
                                darkSide ? "bg-[#635fc7]" : "bg-gray-200"
                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span className={`${
                            darkSide ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                    </Switch>
                    <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-dark-theme.9812582fa58ec8051801098dbfd8c29d.svg"
                         alt="dark-icon" />
                </div>
            </div>
            <div>

            </div>
            {isBoardModalOpen && (
                <AddEditBoardModal setIsBoardModalOpen={setIsBoardModalOpen} type="add" />
            )}
        </div>
    )
}