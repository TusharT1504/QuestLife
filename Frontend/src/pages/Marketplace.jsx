"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins,faStar , faBolt ,faPalette , faCropSimple ,faGift , faMedal } from '@fortawesome/free-solid-svg-icons'

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
                className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col h-full
                  ${
                    item.rarity === "common"
                      ? "border-l-4 border-l-gray-400 border-t border-t-gray-400 border-r border-r-gray-400 border-b border-b-gray-400"
                      : item.rarity === "rare"
                        ? "border-l-4 border-l-blue-400 border-t border-t-blue-400 border-r border-r-blue-400 border-b border-b-blue-400"
                        : item.rarity === "epic"
                          ? "border-l-4 border-l-purple-400 border-t border-t-purple-400 border-r border-r-purple-400 border-b border-b-purple-400"
                          : "border-l-4 border-l-yellow-400 border-t border-t-yellow-400 border-r border-r-yellow-400 border-b border-b-yellow-400"
                  }
                  ${isOwned ? "opacity-75" : ""}
                `}
              >
                {/* Item Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-black text-white">
                        {item.category === "avatar" ? <FontAwesomeIcon icon={faCropSimple} />: 
                         item.category === "badge" ? <FontAwesomeIcon icon={faMedal} />: 
                         item.category === "theme" ? <FontAwesomeIcon icon={faPalette} /> : 
                         item.category === "boost" ? <FontAwesomeIcon icon={faBolt} /> 
                                                  : <FontAwesomeIcon icon={faGift} />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate max-w-[120px] md:max-w-[160px] lg:max-w-[180px] xl:max-w-[200px]">
                          {item.name}
                        </h3>
                        <span
                          className={`block mt-1 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            item.rarity === "legendary"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                              : item.rarity === "epic"
                                ? "bg-purple-100 text-purple-800 border border-purple-300"
                                : item.rarity === "rare"
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : "bg-gray-100 text-gray-800 border border-gray-300"
                          }`}
                        >
                          {item.rarity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description with fixed height for consistency */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ minHeight: "48px", maxHeight: "48px", overflow: "hidden" }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Stock Info - always visible, above description */}
                  <div className="mb-2 min-h-[28px] flex items-center justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      typeof item.stock === "undefined" || item.stock === -1
                        ? "invisible"
                        :  "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                      {typeof item.stock === "undefined" || item.stock === -1
                        ? "Stock: 0 remaining"
                        : `Stock: ${item.stock} remaining`}
                    </span>
                  </div>

                  {/* Coin/Level row */}
                  <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
                      <span className="font-semibold text-gray-900">{item.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faStar} />
                      <span className="text-xs font-medium text-gray-600">Level {item.levelRequired}</span>
                    </div>
                  </div>

                  

                  {/* Action Button */}
                  <div className="mt-auto">
                    {isOwned ? (
                      <div className="w-full py-3 px-4 bg-green-50 text-green-700 rounded-2xl text-center font-medium border border-green-200 flex items-center justify-center">
                        <span className="mr-2">✓</span> Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => purchaseItem(item._id)}
                        disabled={!canAfford || !meetsLevel || purchaseLoading === item._id}
                        className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 ${
                          canAfford && meetsLevel
                            ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
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
            
