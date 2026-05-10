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
    <div
      className="min-h-screen bg-gray-100 flex justify-center items-center p-6"
    >
      <div
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl"
      >
        <h1 className="text-3xl font-bold mb-8">
          Update Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* Name */}
          <div>
            <label className="font-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="font-semibold">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="font-semibold">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={updateProduct.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold">
              Category
            </label>

            <select
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            >
              <option value="">Select category</option>
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
            <label className="font-semibold">
              Release Date
            </label>

            <input
              type="date"
              name="release_date"
              value={updateProduct.release_date?.split("T")[0] || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">

            <label className="font-semibold">
              Product Image
            </label>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-full h-60 object-cover rounded-xl mt-4"
              />
            )}

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-3 mt-4"
            />
          </div>

          {/* Available */}
          <div className="md:col-span-2 flex items-center gap-3">

            <input
              type="checkbox"
              name="available"
              checked={updateProduct.available}
              onChange={handleChange}
            />

            <label>
              Product Available
            </label>

          </div>

          {/* Submit */}
          <div className="md:col-span-2">

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold"
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
