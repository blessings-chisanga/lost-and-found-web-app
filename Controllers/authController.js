import pool from "../dB/db.js";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function signup_get(req, res) {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
}

export function login_get(req, res) {
  res.sendFile(path.join(__dirname, "../public/login.html"));
}

export async function signup_post(req, res) {
  //middleware executes before this, so input is already saitized
  const { student_id, firstName, lastName, email, phone, password } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Checking if student already exists
    const [existing] = await pool.execute(
      "SELECT * FROM students WHERE email = ? OR student_id = ?",
      [email, student_id]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Send to Database
    await pool.execute(
      "INSERT INTO students (student_id, first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
      [student_id, firstName, lastName, email, phone, hashedPassword]
    );

    res
      .status(201)
      .json({success: true, message: "Student registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: "Internal server error" });
  }
}

export function login_post(req, res) {
  const { email, name } = req.body;
  console.log(name + " " + email);
  res.send("you are loged in");
}

export default {
  signup_get,
  signup_post,
  login_get,
  login_post,
};
