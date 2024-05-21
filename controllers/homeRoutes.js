const router = require("express").Router();
const { User, RelaxDeepBreathTable } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // Get all post and JOIN with user data
    const userData = await User.findAll({});

    // Serialize data so the template can read it
    const users = userData.map((user) => user.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", { users, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/inprogress", withAuth, async (req, res) => {
  try {
    // Pass session flag into template
    res.render("inProgress", { logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/breath/:id", withAuth, async (req, res) => {
  console.log("here");
  try {
    const breathData = await RelaxDeepBreathTable.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    const breath = breathData.get({ plain: true });

    res.render("breath", {
      ...breath,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

//goto the add post view
router.get("/addBreath", withAuth, (req, res) => {
  res.render("addBreath", { logged_in: req.session.logged_in });
});

module.exports = router;
