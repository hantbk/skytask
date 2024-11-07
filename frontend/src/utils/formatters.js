/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
    if (!val) return ''
    return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
How to handle Dnd-kit library logic bug when Column is empty:
FE side will automatically create a special card: Placeholder Card, not related to Back-end
This special card will be hidden in the user UI interface.
The Id structure of this card to be Unique is very simple, no need to do complicated random:
"columnId-placeholder-card" (each column can only have a maximum of one Placeholder Card)
Important when creating: must be complete: (_id, boardId, columnId, FE_PlaceholderCard)
 */
export const generatePlaceholderCard = (column) => {
    return {
        _id: `${column._id}-placeholder-card`,
        boardId: column.boardId,
        columnId: column._id,
        FE_PlaceholderCard: true
    }
}

/**
Technique using css pointer-event to block spam click users anywhere there is an api call action
This is a very good technique that takes advantage of Axios Interceptors and CSS Pointer-events 
to only have to write code to handle it once for the entire project
How to use: For all links or buttons that have an api call action, add the class "interceptor-loading" to it and you're done.
 */

export const interceptorLoadingElements = (calling) => {
    // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
    const elements = document.querySelectorAll('.interceptor-loading')
    for (let i = 0; i < elements.length; i++) {
      if (calling) {
        // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
        elements[i].style.opacity = '0.5'
        elements[i].style.pointerEvents = 'none'
      } else {
        // Ngược lại thì trả về như ban đầu, không làm gì cả
        elements[i].style.opacity = 'initial'
        elements[i].style.pointerEvents = 'initial'
      }
    }
  }