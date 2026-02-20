package models

import (
	"time"

	"github.com/teris-io/shortid"
	"gorm.io/gorm"
)

var (
	OrderStatuses = []string{"Order placed", "Preparing", "Baking", "Quality check", "Ready"}
	PizzaTypes    = []string{"Veggie", "Chicken", "Pepperoni", "Mushroom", "Pineapple"}
	PizzaSizes    = []string{"Small", "Medium", "Large", "Extra Large"}
)

type OrderModel struct {
	DB *gorm.DB
}

type Order struct {
	ID           string      `gorm:"primaryKey;size:15" json:"id"`
	Status       string      `gorm:"not null" json:"status"`
	CustomerName string      `gorm:"not null" json:"customerName"`
	Phone        string      `gorm:"not null" json:"phone"`
	Address      string      `gorm:"not null" json:"address"`
	Items        []OrderItem `gorm:"foreignKey:OrderID" json:"pizzas"`
	CreatedAt    time.Time   `gorm:"autoCreateTime" json:"created_at"`
}

type OrderItem struct {
	ID           string `gorm:"primaryKey;size:15" json:"id"`
	OrderID      string `gorm:"index;size:15;not null" json:"orderId"`
	Size         string `gorm:"not null" json:"size"`
	Pizza        string `gorm:"not null" json:"pizza"`
	Instructions string `json:"instructions"`
}

func (oi *OrderItem) BeforeCreate(tx *gorm.DB) error {
	if oi.ID == "" {
		oi.ID = shortid.MustGenerate()
	}
	return nil
}

func (o *OrderModel) CreateOrder(order *Order) error {
	return o.DB.Create(order).Error

}

func (o *OrderModel) GetOrder(id string) (*Order, error) {

	var order Order
	err := o.DB.Preload("Items").First(&order, "id =?", id).Error
	return &order, err
}
