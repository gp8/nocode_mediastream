package rbac

import (
	"log"
	"path/filepath"

	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"gorm.io/gorm"
)

var Enforcer *casbin.Enforcer

func InitRBAC(db *gorm.DB) {
	adapter, err := gormadapter.NewAdapterByDB(db)
	if err != nil {
		log.Fatal(err)
	}
 

	// Get the absolute path to the rbac_model.conf file
	configPath, err := filepath.Abs("rbac/rbac_model.conf")
	if err != nil {
		log.Fatal(err)
	}

	Enforcer, err = casbin.NewEnforcer(configPath, adapter)
	if err != nil {
		log.Fatal(err)
	}

	// Load policies from DB
	err = Enforcer.LoadPolicy()
	if err != nil {
		log.Fatal(err)
	}

	// Add some example policies
	_, err = Enforcer.AddPolicy("admin", "/api/admin", "GET")
	if err != nil {
		log.Printf("Error adding policy: %v", err)
	}
	_, err = Enforcer.AddPolicy("user", "/api/user", "GET")
	if err != nil {
		log.Printf("Error adding policy: %v", err)
	}

	// Save policies to the database
	Enforcer.SavePolicy()
}

func CheckPermission(role, path, method string) bool {
	allowed, err := Enforcer.Enforce(role, path, method)
	if err != nil {
		log.Printf("Error checking permissions: %v", err)
		return false
	}
	return allowed
}
