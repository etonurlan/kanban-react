import { useDispatch, useSelector } from "react-redux"

import { deleteBoard, setBoardActive } from "../store/features/boardSlice"
import type { RootState } from "../store/store"

export const DeleteModals = ({ type, title, onDeleteBtnClick, setIsDeleteModalOpen }:
    {type: string, title: string | undefined, onDeleteBtnClick: any, setIsDeleteModalOpen: Function}) => {
    const dispatch = useDispatch()
    const boards = useSelector((state: RootState) => state.boards.boards)

    const onDeleteBoard = (boards: any) => {
        dispatch(deleteBoard(boards))
        dispatch(setBoardActive({ index: 0 }))
        setIsDeleteModalOpen(false)
    }

    return (
        <div className="fixed right-0 top-0 left-0 bottom-0
                        px-2 py-4 z-50 justify-center items-center
                        flex bg-[#00000080]">
            <div className="max-h-[95vh] my-auto bg-white text-black
                            font-bold shadow-md shadow-[#364e7e1a] max-w-md
                            mx-auto w-full px-8 py-8 rounded-xl
                            dark:bg-[#2b2c37]">
                <h3 className="font-bold text-red-500 text-xl">
                    Delete this {type}?
                </h3>
                {type === "task" ? (
                    <>
                        <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
                            Are you sure that you want to delete the "{title}"
                            task and it`s subtasks? This action cannot be reserved.
                        </p>
                        <div className="flex w-full mt-4 items-center justify-center
                                        space-x-4">
                            <button className="w-full items-center text-white
                                            hover:opacity-75 bg-red-500 py-2
                                            rounded-full"
                                    onClick={onDeleteBtnClick}>
                                    Delete
                            </button>
                            <button className="w-full items-center text-[#635fc7]
                                            hover:opacity-75 bg-[#635fc71a] py-2
                                            rounded-full dark:bg-white"
                                    onClick={() => setIsDeleteModalOpen(false)}>
                                    Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
                        Are you sure that you want to delete the "{title}"
                        board? This action will remove all columns and tasks and
                        cannot be reserved.
                        </p>
                        <div className="flex w-full mt-4 items-center justify-center
                                        space-x-4">
                            <button className="w-full items-center text-white
                                            hover:opacity-75 bg-red-500 py-2
                                            rounded-full"
                                    onClick={() => onDeleteBoard(boards)}>
                                    Delete
                            </button>
                            <button className="w-full items-center text-[#635fc7]
                                            hover:opacity-75 bg-[#635fc71a] py-2
                                            rounded-full dark:bg-white"
                                    onClick={() => setIsDeleteModalOpen(false)}>
                                    Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}