import { useState } from "react"
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

import { addBoard, editBoard } from "../store/features/boardSlice";
import type { RootState } from "../store/store"
import { BoardState } from "../store/features/boardSlice"

type Column = {
    id?: string;
    columnName?: string;
    tasks?: object[];
}

export const AddEditBoardModal = ({ setIsBoardModalOpen, type }: {setIsBoardModalOpen: Function, type: string}) => {
    const dispatch = useDispatch()
    const boards = useSelector((state: RootState) => state.boards.boards)
    let board: BoardState | undefined = {}
    board = boards.find((board: BoardState) => board.isActive)
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [boardName, setBoardName] = useState("")
    const [columns, setColumns] = useState<Column[]>([])

    // let setIsValid = true;

    const changeColumnName = (id: string, newValue: string) => {
        setColumns((prevState) => {
            const newState = [...prevState]
            const column: Column = newState.find((col: Column) => col.id === id)!
            column.columnName = newValue
            return newState
        })
    }

    const deleteColumn = (id: string) => {
        setColumns((prevState) => prevState.filter((el: Column) => el.id !== id))
    }
    
    if (type === "edit" && isFirstLoad) {
        setColumns(
          board?.columns?.map((col) => {
            return { ...col, id: uuidv4() };
          })!
        );
        setBoardName(board?.name!);
        setIsFirstLoad(false);
    }

    const onSubmit = (type: string) => {
        setIsBoardModalOpen(false)
        if (type === 'add') {
            dispatch(addBoard({ boardName, columns }))
        } else {
            dispatch(editBoard({ boardName, columns }))
        }
    }

    const validate = () => {
        // setIsValid = false
        if (!boardName.trim()) {
          return false;
        }
        for (let i = 0 ; i < columns.length ; i++) {
          if (!columns[i]?.columnName?.trim()) {
            return false;
          }
        }
        // setIsValid = true
        return true;
    };

    return (
        <div className="fixed right-0 top-0 px-2 py-4 bg-[#00000080]
                        z-50 left-0 bottom-0 justify-center
                        items-center flex">
            <div className="max-h-[95vh] bg-white dark:bg-[#2b2c37] dark:text-white
                            text-black font-bold shadow-md shadow-[#364e7e1a]
                            max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl">
                <div className="flex items-center">
                    <h3 className="text-lg mr-auto">
                        {type === 'add' ? 'Add New Board' : 'Edit Board'}
                    </h3>
                    <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-cross.d4ca9e0d2a82f7ea4ae08238a42f84ed.svg"
                        alt="Close"
                        className="m-4 cursor-pointer"
                        onClick={() => setIsBoardModalOpen(false)} />
                </div>
                
                <div className="mt-8 flex flex-col space-y-1">
                    <h4 className="text-sm text-gray-500 dark:text-white">Board Name</h4>
                    <input className="bg-transparent px-4 py-2 rounded-md text-sm
                                      border-[0.5px] border-gray-600
                                      focus:outline-[#635fc7] outline-1 ring-0"
                           type="text" placeholder="e.g Web Design" value={boardName}
                           onChange={(event) => setBoardName(event.target.value)} />
                </div>
                <div className="mt-8 flex flex-col space-y-3">
                    <h4 className="text-sm text-gray-500 dark:text-white">Board Columns</h4>
                    {columns.length > 0 && columns.map((column: Column) => (
                        <div className="flex items-center w-full">
                            <input  className="bg-transparent flex-grow px-4 py-2
                                                rounded-md text-sm border-[0.5px]
                                            border-gray-600 focus:outline-[#635fc7]
                                                outline-[1px]"
                                    type="text" placeholder="e.g Done" value={column.columnName}
                                    onChange={(e) => {
                                        changeColumnName(column.id!, e.target.value)
                                    }} />
                            <img src="https://kanban-task-management-react-tailwind.vercel.app/static/media/icon-cross.d4ca9e0d2a82f7ea4ae08238a42f84ed.svg"
                                    alt="Delete"
                                    className="m-4 cursor-pointer"
                                    onClick={() => {
                                        deleteColumn(column.id!)
                                    }} />
                        </div>
                    ))}
                    <div>
                        <button className="w-full items-center hover:opacity-70 text-white
                                           bg-[#635fc7] py-2 rounded-full
                                           dark:text-[#635fc7] dark:bg-white"
                                onClick={() => {
                                    setColumns((state) => [
                                        ...state,
                                        { columnName: "", tasks: [], id: uuidv4() },
                                    ])
                                }}>
                            + Add New Column
                        </button>
                        <button className="w-full items-center hover:opacity-70 text-white
                                           bg-[#635fc7] py-2 rounded-full mt-8"
                                onClick={() => {
                                    const isValid = validate();
                                    if (isValid === true) onSubmit(type);
                                }}>
                            {type === 'add' ? 'Create New Board' : 'Save changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}