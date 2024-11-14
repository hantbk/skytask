import jwt from 'jsonwebtoken'
/**
 * Function tạo mới một token
 * @param userInfo: Những thông tin muốn đính kèm vào token
 * @param secretSignature: Chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để tên là privateKey tùy đều được
 * @param tokenLife: Thời gian sống của token
 * @return token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện Jwt - Thuật toán mặc định là HS256
    return jwt.sign( userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

/**
 * Function kiểm tra tính hợp lệ của token
 */
const verifyToken = async (token, secretSignature) => {
  try {
    return jwt.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
