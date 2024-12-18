const Student = require("../../models/Student");

const initiateAccountSetup = async (req, res) => {
    const { EnrollmentId } = req.body;
  
    try {
        const student = await Student.findOne({ EnrollmentId }).populate("DBid", "email");
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
  
        const otp = generateOTP();
        student.otp = otp;
        student.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
        await student.save();
  
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
  
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: student.DBid.email,
            subject: 'OTP for Account Setup',
            text: `Your OTP is: ${otp}`,
        });
  
        res.status(200).json({ message: 'OTP sent to your institute email.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
  };
  
  const verifyOtp = async (req, res) => {
    const { EnrollmentId, otp } = req.body;
  
    try {
        const student = await Student.findOne({ EnrollmentId });
  
        if (!student || student.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
  
        if (student.otp !== otp) {
            return res.status(400).json({ message: 'Incorrect OTP' });
        }
  
        res.status(200).json({message: 'OTP verified successfully'});
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
  };
  
  const createPassword = async (req, res) => {
      const { EnrollmentId, password } = req.body;
  
      try {
          const student = await Student.findOne({ EnrollmentId }).populate("DBid", "password");
          if (!student) {
              return res.status(404).json({ message: 'Student not found' });
          }
  
          student.DBid.password = password;
          await student.DBid.save();
  
          student.otp = undefined;
          student.otpExpires = undefined;
  
          await student.save();
  
          res.status(200).json({ message: 'Password created successfully!' });
      } catch (error) {
          console.error('Error creating password:', error);
          res.status(500).json({ message: 'Error creating password' });
      }
  };

module.exports = {
    initiateAccountSetup,
    verifyOtp,
    createPassword,
}