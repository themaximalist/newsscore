const Reader = require("../models/reader");

module.exports = async function (req, res) {
    const email = req.body.email;
    try {
        if (!email) throw "No email provided";

        const reader = await Reader.create({ email });
        if (!reader) throw "Error creating reader";

        res.cookie("newsletter", true);

        res.render("partials/_newsletter_signup", { email });
    } catch (e) {
        const error = `Error while subscribing to newsletter, please try again or contact hello@themaximalist.com`;
        res.render("partials/_newsletter", { error, email });
    }
}