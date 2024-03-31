import Category from "../models/Category";
import Product from "../models/product";
import { categorySchema } from "../schemas/product";

export const getAll = async (req, res) => {
   
    try {
        const movies = await Category.find()
        res.send(movies)
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
        const movie = await Category.findById(id)
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
        const { error } = categorySchema.validate(req.body, { abortEarly: false })
        if (!error) {
            const movie = await Category.create(req.body)
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
    res.end()
};
export const update = async (req, res) => {
    const { id } = req.params
    try {
        const { error } = categorySchema.validate(req.body, { abortEarly: false })
        if (!error) {
            const movie = await Category.findByIdAndUpdate(id, req.body)
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
        const updateCateProduct = await Product.updateMany({ "Product.categoryId": id }, { $set: { "Product.$.categoryId": null } });
        if(!updateCateProduct) {res.send({message:"update product thất bại"})
         return}
        const data = await Category.findByIdAndDelete(id)
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
//         const Category = await Category.findById(id) as ICategory;

//         if (!user.role || user.role !== "admin") {
//             return res.status(403).json({
//                 message: "Bạn không có quyền phục hồi sản phẩm",
//             });
//         }
//         if (!Category) {
//             return res.status(404).json({
//                 message: "Không tìm thấy sản phẩm",
//             });
//         }
//         if (!Category.deleted) {
//             return res.status(400).json({
//                 message: "Sản phẩm chưa bị xóa mềm",
//             });
//         }

//         Category.deleted = false;
//         Category.deletedAt = null;

//         const restoredCategory = await Category.save();

//         return res.status(200).json({
//             message: "Phục hồi sản phẩm thành công",
//             data: restoredCategory,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "Phục hồi sản phẩm không thành công",
//             error: error.message
//         });
//     }
// };
