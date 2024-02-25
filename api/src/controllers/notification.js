const express = require("express");
const passport = require("passport");
const router = express.Router();

const UserObject = require("../models/user");

const SERVER_ERROR = "SERVER_ERROR";

const { Resend } = require("resend");

router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const organisation = req.user.organisation;
    const users = await UserObject.find({ organisation });
    const emails = users.map((user) => user.email).filter((email) => email);
    console.log("emails🔽", emails);
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log("resend🔽", resend);
    const { data, error } = await resend.emails.send({
      from: "contact@villacapodimuro.fr",
      to: emails,
      subject: "💡 Reminder: Complete your timesheet",
      html: "<p> Hello team, please complete your timesheet <strong>before this weekend 😉</strong>!</p>",
    });
    console.log("error🔽", error);
    if (error) {
      throw new Error(error);
    }

    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
