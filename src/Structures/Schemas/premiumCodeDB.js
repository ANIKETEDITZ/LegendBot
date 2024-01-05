module.exports = model(
    'premiumCodeDB',
    new Schema(
        {
            code: {
                type: String,
                required: true,
            },
            plan: {
                type: String,
                required: true,
            },
            expiresAt: {
                type: Number,
                required: true,
            },
        },
        {
            versionKey: false, // You should be aware of the outcome after set to false
        },
    ),
);
