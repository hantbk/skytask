import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới Model để xử lý lưu bản ghi newBoard vào Database
    // ...

    // Trả kết quả về Controller, trong Service luôn cần có return
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
