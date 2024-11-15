import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

const createNew = async (reqBody) => {
  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    // Tạo data để lưu vào database
    // Nếu email là user@gmail.com thì name sẽ là "user"
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // Tham số thứ 2 là độ phức tạp, càng cao băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // mặc định để giống username, sau làm tính năng update user
      verifyToken: uuidv4()

    }

    // Thực hiện lưu thông tin user vào database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = '[Verify email] Complete your Taskflow account setup'
    const logoUrl = 'https://raw.githubusercontent.com/hantbk/taskflow/refs/heads/main/frontend/src/assets/taskflow-logo.png'
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="Taskflow Team Logo" style="width: 150px; height: auto;" />
    </div>
    <h3 style="color: #333;">Hi ${getNewUser.username},</h3>
    <p style="font-size: 16px; line-height: 1.5;">
      Thanks for signing up for Taskflow. To complete your account setup, please verify your email address by clicking the link below:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${verificationLink}" target="_blank" style="display: inline-block; padding: 12px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px;">
        Verify my email address
      </a>
    </div>
    <p style="font-size: 14px; color: #555;">
      If you did not recently create an account, you can ignore this email. If you are having trouble accessing your account, please contact our Support Team.
    </p>
    <p style="font-size: 14px; color: #555;">We look forward to serving you.</p>
    <p style="font-size: 14px; color: #555;">—The Taskflow Team</p>
  </div>
`

    // Call Brevo Provider send mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    // return dữ liệu cho phía Controller
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async (reqBody) => {
  try {
    // Query user trong Database
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already verified!')

    if (existUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid token!')

    // Nếu mọi thứ ổn thì cập nhật isActive = true và xóa token
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    // Update thông tin user
    const updatedUser = await userModel.update(existUser._id, updateData)
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not verified!')

    // Kiểm tra password
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your Email or Password is incorrect!')
    }
    /** Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE */
    // Thông tin sẽ đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = { _id: existUser._id, email: existUser.email }
    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )
    // Trả về thông tin của user kèm theo 2 cái token vừa tạo ra
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clienRefreshToken) => {
  try {
    // Bước 01: Thực hiện giải mã token xem nó có hợp lệ hay là không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clienRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )
    // Lấy thông tin từ refreshTokenDecoded, không cần truy vấn database
    const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email }

    // Bước 02: Tạo ra một cái accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken
}
