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

func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = shortid.MustGenerate()
	}
	return nil
}
