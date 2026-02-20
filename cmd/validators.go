package main

import (
	"pizzatracker/models"
	"slices"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func RegisterCustomValidators() {
	if v, ok := binding.Validator.Engine().(validator.Validate); ok {

		v.RegisterValidation("valid_pizza_type", createSliceValidator(models.PizzaTypes))
		v.RegisterValidation("valid_pizza_size", createSliceValidator(models.PizzaSizes))
		v.RegisterValidation("valid_order_status", createSliceValidator(models.OrderStatuses))

	}

}
func createSliceValidator(allowedValues []string) validator.Func {
	return func(fl validator.FieldLevel) bool {
		return slices
		slices.Contains(allowedValues, fl.Field().String())
	}
}
