import { useState } from 'react'
import Box from '@mui/material/Box'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useForm } from 'react-hook-form'
import { createNewBoardAPI } from '~/apis'
import CreateModal from '~/components/AppBar/CreateModal'

import { styled } from '@mui/material/styles'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

// BOARD_TYPES tương tự bên model phía Back-end (nếu cần dùng nhiều nơi thì hãy đưa ra file constants, không thì cứ để ở đây)
const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

/**
 * Bản chất của cái component SidebarCreateBoardModal này chúng ta sẽ trả về một cái SidebarItem để hiển thị ở màn Board List cho phù hợp giao diện bên đó, đồng thời nó cũng chứa thêm một cái Modal để xử lý riêng form create board nhé.
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm()

  const [isOpen, setIsOpen] = useState(false)
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    // Reset lại toàn bộ form khi đóng Modal
    reset()
  }

  const [backgroundImageFile, setBackgroundImageFile] = useState(null)


  const submitCreateNewBoard = async (data) => {
    const { title, description, type } = data;

    // Create a new FormData object to send data including file
    let reqData = new FormData();
    reqData.append('title', title);  // Appending title to FormData
    reqData.append('description', description);  // Appending description
    reqData.append('type', type);  // Appending type (Public/Private)

    // If there is a background image file, append it to FormData
    if (backgroundImageFile) {
      reqData.append('boardCover', backgroundImageFile);
    }

    // Assuming createNewBoardAPI is a function that handles the POST request
    await createNewBoardAPI(reqData).then(() => {
      // Close the modal
      handleCloseModal();
      // Notify parent component to refresh or handle after creation
      afterCreateNewBoard();
    }).catch((error) => {
      // Handle error (optional)
      console.error("Error creating new board:", error);
    });
  }


  // <>...</> nhắc lại cho bạn anof chưa biết hoặc quên nhé: nó là React Fragment, dùng để bọc các phần tử lại mà không cần chỉ định DOM Node cụ thể nào cả.
  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>

      <CreateModal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        reset={reset}
        errors={errors}
        submitCreateNewBoard={submitCreateNewBoard}
        setBackgroundImageFile={setBackgroundImageFile}
      />
    </>
  )
}

export default SidebarCreateBoardModal