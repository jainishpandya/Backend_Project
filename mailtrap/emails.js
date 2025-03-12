import { PASSWORD_RESET_REQUEST_TEMPLATE, SET_PASSWORD_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { sender, mailtrapClient } from "./mailtrapConfig.js";

export const sendVerificationEmail = async (username, emailAddress, verificationToken) => {
    const recipients = [
        {
          email: emailAddress,
        }
      ];

      console.log(emailAddress, verificationToken);
      
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Hey "+ username +", Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken).replace("PersonName", username),
            category: "Email Verification"
        })
        console.log("Email sent successfully", response);
        return response
        
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email : ${error}`)
    }
}



export const sendPasswordResetEmail = async (email, resetURL) => {

    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: "testjainish8@gmail.com",
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
        console.log("Email sent successfully", response);
        return response
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

export const sendSetPasswordEmail = async (email, resetURL) => {
    const recipients = [{ email }];

    console.log(resetURL);
    
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Set Password",
            html: SET_PASSWORD_EMAIL_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Set Password"
        })

        console.log("Email sent successfully", response);
        return response
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`)
    }
}