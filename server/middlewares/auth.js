
// Middleware to check userID and hasPremiumPlan

export const auth = async (req, res, next) => {
    try {
        const { userId } = await req.auth()

    } catch (error) {

    }
}