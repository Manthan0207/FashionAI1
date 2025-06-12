import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config() //so we can access the JWT secret key

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' }) //{userId} is called payload

    res.cookie("authToken", token,
        {
            httpOnly: true, // cookie can not be accessed by client side js , prevents XSS attack ,
            secure: process.env.NODE_ENV === 'production',  //it will be https in production while development is http
            sameSite: "strict", //prevents csrf attack
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    return token
}


// httpOnly: true	This prevents JavaScript from accessing the cookie in the browser.
// ✅ Protects against XSS (Cross-Site Scripting) attacks.

// secure: process.env.NODE_ENV === 'production'	Only allows the cookie to be sent over HTTPS when you're in a production environment.
// ✅ Prevents data from being sent over insecure HTTP.

// sameSite: "strict"	Tells the browser to not send this cookie with cross-site requests.
// ✅ Protects against CSRF (Cross-Site Request Forgery) attacks.