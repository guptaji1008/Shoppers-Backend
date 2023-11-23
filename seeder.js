import dotenv from 'dotenv'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userSchema.js'
import Product from './models/productSchema.js'
import Order from './models/orderSchema.js'
import connectDb from './db/conn.js'

dotenv.config();
connectDb()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        // await User.deleteMany()

        // await User.insertMany(users);
        const [adminId] = await User.find({isAdmin: true}).select("_id")
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminId._id }
        })
        await Product.insertMany(sampleProducts)
        console.log('Data Imported')
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data destroyed')
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
};

const setImage = async () => {
    const image = {
        url: process.env.SAMPLE_IMAGE_URL,
        public_url: process.env.SAMPLE_PUBLIC_ID
    }

    const [adminId] = await User.find({isAdmin: true}).select("_id")
    const newAllProduct = products.map((prod) => ({
        ...prod, image, user: adminId._id
    }))

    await Product.insertMany(newAllProduct)

}

if (process.argv[2] === "-d") {
    destroyData()
} else {
    // importData()
    setImage()
}