//Load và khởi tạo dotenv để đọc biến môi trường để có thể truy cập qua process.env
require("dotenv").config();
//polyfill fetch
global.fetch = require("node-fetch");
//Load express và tạo app
const app = require("express")();
//Load Giphy SDK
const { GiphyFetch } = require("@giphy/js-fetch-api");
//Khởi tạo đối tượng GiphyFetch, GIPHY_API_KEY lấy từ biến môi trường
const gf = new GiphyFetch(process.env.GIPHY_API_KEY);
const path = require("path");
//Khai báo route cho đường dẫn /
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

//Khai báo route get /api/get?page=<page_number>
app.get("/api/get", async (req, res) => {
    try {
        let page = Number(req.query.page || 1); //lấy query param "page", nếu không có thì mặc định là 1
        let limit = 10;
        //tìm kiếm ảnh theo từ khóa "falling"
        let results = await gf.search("falling", {
            sort: "relevant", //sắp xếp theo độ liên quan
            offset: (page - 1) * limit, //tính offset dựa trên page và limit
            limit: limit, //giới hạn số ảnh lấy về
        });

        return res.json({
            data: results.data.map((gif) => gif.images.downsized_medium),
            pagination: results.pagination,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

//lấy PORT từ biến môi trường, nếu không có thì chạy trên port 3413
const PORT = process.env.PORT || 3413;

//start app và log
app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Running on port ${PORT}`);
});
