//  https://www.npmjs.com/package/jsonwebtoken

import jwt from 'jsonwebtoken'
/**
 * Function tạo mới một token - Cần 3 tham số đầu vào
 * @param {object} userInfo: Những thông tin muốn đính kèm vào token
 * @param {string} secretSignature: Chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để tên là privateKey tùy đều được
 * @param {string} tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
    try {
        // Hàm sign() của thư viện Jwt - Thuật toán mặc định là HMAC SHA256
        return jwt.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
    } catch (error) { throw new Error(error) }
}

/**
 * Function kiểm tra một token có hợp lệ hay không
 * Hợp lệ ở đây hiểu đơn giản là cái token được tạo ra có đúng với cái chữ ký bí mật secretSignature trong dự án hay không
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
