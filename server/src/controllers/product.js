import Product from "../models/product";
import Category from "../models/Category";
import { productSchema } from "../schemas/product";

export const getAll = async (req, res) => {
    const PAGE_SIZE = 20
    var { page } = req.query
    try {
        if(!page){
            page = 1
        }
        else if (page){
            page = parseInt(page)
            var skipcount = (page - 1) * PAGE_SIZE
        }
        const movies = await Product.find({}).skip(skipcount).limit(PAGE_SIZE).populate("categoryId")
        res.send(movies)
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
        res.end()
     }
export const getCount = async (req, res) => {
    try {
        const movie = await Product.find()
        res.send({count:movie.length})
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
    res.end()
}

export const get = async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Product.findById(id).populate("categoryId")
        res.send(movie)
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
    res.end()
}
export const create = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false })
        if (!error) {
            const movie = await Product.create(req.body)
            res.send({
                massage: "Tạo mới movie thành công",
                data: movie
            })
        } else {
            const messages = error.details.map(item => item.message)
            res.status(400).send({
                message: messages
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
};
export const update = async (req, res) => {
    const { id } = req.params
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false })
        if (!error) {            
            const movie = await Product.findByIdAndUpdate( id, req.body)
            res.send({
                massage: "Cập nhật movie thành công",
                data: movie
            })
        } else {
            const messages = error.details.map(item => item.message)
            res.status(400).send({
                message: messages
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
    res.end()
}

export const remove = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Product.findByIdAndDelete(id)
        if (data) {
            res.send({
                message: "Xoá movie thành công",
                data: data
            })
        } else {
            res.status(400).send({
                message: "Bản ghi không tồn tại"
            })
        }

    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
};
// export const restore = async (req, res) => {
//     try {
//         const id = req.params.id as string;
//         const user = req.user as IUser;
//         const product = await Product.findById(id) as IProduct;

//         if (!user.role || user.role !== "admin") {
//             return res.status(403).json({
//                 message: "Bạn không có quyền phục hồi sản phẩm",
//             });
//         }
//         if (!product) {
//             return res.status(404).json({
//                 message: "Không tìm thấy sản phẩm",
//             });
//         }
//         if (!product.deleted) {
//             return res.status(400).json({
//                 message: "Sản phẩm chưa bị xóa mềm",
//             });
//         }

//         product.deleted = false;
//         product.deletedAt = null;

//         const restoredProduct = await product.save();

//         return res.status(200).json({
//             message: "Phục hồi sản phẩm thành công",
//             data: restoredProduct,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "Phục hồi sản phẩm không thành công",
//             error: error.message
//         });
//     }
// };
