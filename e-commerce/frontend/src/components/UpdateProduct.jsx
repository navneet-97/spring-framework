import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getData from "../services/useContext";

const UpdateProduct = () => {
  const { API, fetchProducts } = getData();
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    release_date: "",
    available: false,
    quantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        const productData = response.data;
        setUpdateProduct(productData);

        // fetch image
        const imageResponse = await API.get(`/product/${id}/image`,
          {
            responseType: "blob",
          }
        );

        const imageFile = new File(
          [imageResponse.data],
          productData.imageName,
          {
            type: imageResponse.data.type,
          }
        );

        setImage(imageFile);
      } catch (error) {
        console.log("Fetch product error", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append(
        "product",
        new Blob(
          [
            JSON.stringify({
              ...updateProduct,
              price: Number(updateProduct.price),
              quantity: Number(updateProduct.quantity),
            }),
          ],
          {
            type: "application/json",
          }
        )
      );

      if (image) {
        formData.append("imageFile", image);
      }

      await API.put(
        `/product/${id}`,
        formData
      );

      alert("Product updated successfully");
      fetchProducts();
      navigate(`/product/${id}`);
    } catch (error) {
      console.log("Update error", error);
      alert("Failed to update product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">

        <div className="bg-indigo-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">
            Update Product
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Description
            </label>

            <textarea
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Stock Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={updateProduct.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Category
            </label>

            <select
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          {/* Release Date */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Release Date
            </label>

            <input
              type="date"
              name="release_date"
              value={updateProduct.release_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Product Image
            </label>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="mb-4 w-full h-60 object-cover rounded-xl mt-4"
              />
            )}

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl p-4 cursor-pointer"
              required
            />
          </div>

          {/* Available */}
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              name="available"
              checked={updateProduct.available}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-600"
            />

            <label className="font-medium text-gray-700 dark:text-gray-200">
              Product Available
            </label>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold cursor-pointer"
            >
              Update Product
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
