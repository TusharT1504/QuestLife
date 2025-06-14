"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

const Marketplace = () => {
  const { user, updateUser } = useAuth()
  const [items, setItems] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [purchaseLoading, setPurchaseLoading] = useState(null)

  const categories = [
    { id: "all", name: "All Items", color: "bg-gray-800" },
    { id: "avatar", name: "Avatars", color: "bg-blue-600" },
    { id: "badge", name: "Badges", color: "bg-purple-600" },
    { id: "theme", name: "Themes", color: "bg-green-600" },
    { id: "boost", name: "Boosts", color: "bg-yellow-600" },
    { id: "real", name: "Real Items", color: "bg-red-600" },
  ]

  const rarityColors = {
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-yellow-300 bg-yellow-50",
  }

  useEffect(() => {
    fetchItems()
    fetchInventory()
  }, [])

  const fetchItems = async () => {
    try {
      setError("")
      const response = await fetch("http://localhost:5000/api/marketplace/items")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching items:", error)
      setError("Failed to load marketplace items")
    } finally {
      setLoading(false)
    }
  }

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No token found, skipping inventory fetch")
        return
      }

      const response = await fetch("http://localhost:5000/api/marketplace/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setInventory(data || [])
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const purchaseItem = async (itemId) => {
    if (!user) {
      alert("Please log in to purchase items")
      return
    }

    setPurchaseLoading(itemId)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:5000/api/marketplace/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      })

      const data = await response.json()

      if (response.ok) {
        if (updateUser && data.remainingCoins !== undefined) {
          updateUser({ ...user, coins: data.remainingCoins })
        }

        fetchInventory()
        alert("Item purchased successfully!")
      } else {
        alert(data.message || "Failed to purchase item")
      }
    } catch (error) {
      console.error("Error purchasing item:", error)
      alert("Error purchasing item. Please try again.")
    } finally {
      setPurchaseLoading(null)
    }
  }

  const filteredItems = selectedCategory === "all" ? items : items.filter((item) => item.category === selectedCategory)

  const isItemOwned = (itemId) => {
    if (!inventory || !Array.isArray(inventory)) return false
    return inventory.some((invItem) => invItem.itemId && invItem.itemId._id === itemId)
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Marketplace</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                setLoading(true)
                setError("")
                fetchItems()
              }}
              className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-32 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Marketplace</h1>
          <p className="text-xl text-gray-600 mb-6">Spend your hard-earned coins on amazing items!</p>

          {/* User Stats */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-1" />
              <span className="font-semibold text-gray-900 text-lg">{user?.coins || 0} Coins</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-900 text-lg">Level {user?.level || 1}</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 shadow-sm ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-md`
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isOwned = isItemOwned(item._id)
            const canAfford = (user?.coins || 0) >= (item.price || 0)
            const meetsLevel = (user?.level || 1) >= (item.levelRequired || 1)

            return (
              <div
                key={item._id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border-2 ${
                  rarityColors[item.rarity] || rarityColors.common
                } ${isOwned ? "opacity-75" : ""}`}
              >
                {/* Item Image */}
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150"
                    }}
                  />
                </div>

                {/* Item Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.rarity === "legendary"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.rarity === "epic"
                            ? "bg-purple-100 text-purple-800"
                            : item.rarity === "rare"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.rarity}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
                      <span className="font-semibold text-gray-900">{item.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">⭐</span>
                      <span className="text-xs text-gray-600">Lv.{item.levelRequired}</span>
                    </div>
                  </div>

                  {/* Stock Info */}
                  {item.stock !== -1 && <div className="text-xs text-gray-500 mb-4">Stock: {item.stock} remaining</div>}

                  {/* Action Button */}
                  {isOwned ? (
                    <div className="w-full py-3 px-4 bg-green-50 text-green-700 rounded-2xl text-center font-medium border border-green-200">
                      ✓ Owned
                    </div>
                  ) : (
                    <button
                      onClick={() => purchaseItem(item._id)}
                      disabled={!canAfford || !meetsLevel || purchaseLoading === item._id}
                      className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 ${
                        canAfford && meetsLevel
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {purchaseLoading === item._id ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Purchasing...
                        </span>
                      ) : !canAfford ? (
                        "Not enough coins"
                      ) : !meetsLevel ? (
                        `Level ${item.levelRequired} required`
                      ) : (
                        "Purchase"
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 opacity-50">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No items found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace
