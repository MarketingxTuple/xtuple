/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV.Util",
    kind: enyo.Component,
    published: {
      workspacePanelDescriptor: null,
      relationTitleFields: {},
      history: []
    },
    create: function () {
      this.inherited(arguments);

      /**
       * This JSON descriptor can easily be stored somewhere else. It doesn't need
       * to be enyo-dependent.
       */
      /**
       * I've thought about getting the workspace code to figure out the
       * appropriate fieldType dynamically (if it's a date object, use DateWidget,
       * etc. But I think this would fail if the field happens to be null.
       */
      this.setWorkspacePanelDescriptor({
        // the key is uppercase because the model name is uppercase
        Account: [
          {
            title: "Account Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "number" }
            ]
          },
          {
            title: "Contact",
            fields: [
              // TODO: we can avoid having to specify the modelType by looking in the
              // *relations* of the model, which will work even if the submodel is null
              { fieldName: "primaryContact", fieldType: "relation", modelType: "XM.ContactInfo" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "comments",
            objectName: "comments"
          }

        ],

        Contact: [
          {
            title: "Contact Info",
            fields: [
              { fieldName: "firstName" },
              { fieldName: "lastName" },
              { fieldName: "jobTitle" },
              { fieldName: "phone" },
              { fieldName: "primaryEmail" }
            ]
          },
          {
            title: "Account Info",
            fields: [
              { fieldName: "account", fieldType: "relation", modelType: "XM.AccountInfo" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "comments",
            objectName: "comments"
          }
        ],

        ToDo: [
          {
            title: "ToDo Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "description" },
              { fieldName: "status", fieldType: "dropdown", modelType: "XM.projectStatuses" },
              { fieldName: "priority", fieldType: "dropdown", modelType: "XM.priorities" },
              { fieldName: "incident", fieldType: "relation", modelType: "XM.IncidentInfo" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", fieldType: "date" },
              { fieldName: "dueDate", fieldType: "date" },
              { fieldName: "assignDate", fieldType: "date" },
              { fieldName: "completeDate", fieldType: "date" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "comments",
            objectName: "comments"
          }
        ],

        Opportunity: [
          {
            title: "Opportunity Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "name" },
              { fieldName: "account", fieldType: "relation", modelType: "XM.AccountInfo" },
              { fieldName: "opportunityStage", fieldType: "dropdown", modelType: "XM.opportunityStages" },
              { fieldName: "opportunityType", fieldType: "dropdown", modelType: "XM.opportunityTypes" },
              { fieldName: "opportunitySource", fieldType: "dropdown", modelType: "XM.opportunitySources" }
            ]
          },
          {
            title: "Schedule",
            location: "bottom", // TODO remove this line
            fields: [
              { fieldName: "startDate", fieldType: "date" },
              { fieldName: "assignDate", fieldType: "date" },
              { fieldName: "targetClose", fieldType: "date" },
              { fieldName: "actualClose", fieldType: "date" }
            ]
          },
          {
            title: "Notes",
            location: "bottom",
            fields: [
              { fieldName: "amount", fieldType: "number" },
              { fieldName: "probability", fieldType: "number" },
              { fieldName: "notes" }
            ]
          },
          {
            title: "Comments",
            //location: "bottom",
            boxType: "comments",
            objectName: "comments"
          }
        ],

        Incident: [
          {
            title: "Incident Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "description" },
              { fieldName: "notes" }
            ]
          },
          {
            title: "Relationships",
            fields: [
              { fieldName: "owner", fieldType: "relation", modelType: "XM.UserAccountInfo" },
              { fieldName: "contact", fieldType: "relation", modelType: "XM.ContactInfo" },
              { fieldName: "account", fieldType: "relation", modelType: "XM.AccountInfo" },
              { fieldName: "item", fieldType: "relation", modelType: "XM.ItemInfo" }
            ]
          },
          {
            title: "History",
            boxType: "grid",
            objectName: "history",
            location: "bottom",
            fields: [
              { fieldName: "description" },
              { fieldName: "created", fieldType: "readonly" },
              { fieldName: "createdBy", fieldType: "readonly" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "comments",
            objectName: "comments"
          }
        ],

        Project: [
          {
            title: "Project Info",
            fields: [
              { fieldName: "number", placeholder: "Enter the project number" },
              { fieldName: "name" },
              { fieldName: "notes" },
              { fieldName: "status", fieldType: "dropdown", modelType: "XM.projectStatuses" }
            ]
          },
          {
            title: "Summary",
            location: "bottom",
            fields: [
              { fieldName: "budgetedHoursTotal", fieldType: "readonly" },
              { fieldName: "actualHoursTotal", fieldType: "readonly" },
              { fieldName: "actualHoursBalance", fieldType: "readonly" },
              { fieldName: "budgetedExpensesTotal", fieldType: "readonly" },
              { fieldName: "actualExpensesTotal", fieldType: "readonly" },
              { fieldName: "balanceExpensesTotal", fieldType: "readonly" }

            ]
          },
          {
            title: "Schedule",
            location: "bottom", // TODO: delete
            fields: [
              { fieldName: "owner", fieldType: "relation", modelType: "XM.UserAccountInfo" },
              { fieldName: "assignedTo", fieldType: "relation", modelType: "XM.UserAccountInfo" },
              { fieldName: "dueDate", fieldType: "date" },
              { fieldName: "assignDate", fieldType: "date" },
              { fieldName: "startDate", fieldType: "date" },
              { fieldName: "completeDate", fieldType: "date" }
            ]
          },
          {
            title: "Tasks",
            //location: "bottom",
            boxType: "grid",
            objectName: "tasks",
            fields: [
              { label: "number", fieldName: "number", width: "120" },
              { label: "name", fieldName: "name", width: "120" },
              { label: "notes", fieldName: "notes", width: "220" },
              { fieldName: "dueDate", fieldType: "date", width: "100" },
              { label: "actualHours", fieldName: "actualHours", fieldType: "number", width: "40" },
              { label: "actualExpenses", fieldName: "actualExpenses", fieldType: "number", width: "40" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "comments",
            objectName: "comments"
          }
        ]
      });


      this.getRelationalTitleFields = {};
      this.getRelationalTitleFields["XM.UserAccountInfo"] = "username";
      this.getRelationalTitleFields["XM.ContactInfo"] = "lastName";
      this.getRelationalTitleFields["XM.IncidentInfo"] = "number";
      this.getRelationalTitleFields["XM.AccountInfo"] = "name";
      this.getRelationalTitleFields["XM.ItemInfo"] = "number";

    },
    getFieldType: function (value) {
      if (!value) {
        return "onyx.Input";
      } else if (value === 'number') {
        return "XV.NumberWidget";
      } else if (value === 'date') {
        return "XV.DateWidget";
      } else if (value === 'relation') {
        return "XV.RelationalWidget";
      } else if (value === 'dropdown') {
        return "XV.DropdownWidget";
      } else if (value === 'grid') {
        return "XV.GridWidget";
      } else if (value === 'readonly') {
        return "XV.ReadOnlyWidget";
      } else if (value === 'comments') {
        return "XV.CommentsWidget";
      }
    },
    /**
     * Removes all the children from a parent object. This is a simple utility function.
     */
    removeAllChildren: function (parent) {
        // It's necessary to save the length into a variable or else the loop ends
        // prematurely. It's also necessary to delete the children always from the
        // 0 spot and not the i spot, because the target moves as you delete.
        var childrenCount = parent.children.length;
        for (var i = 0; i < childrenCount; i++) {
          parent.removeChild(parent.children[0]);
        }
      },

    // XXX there's got to be a better way to get the name of the model
    // that's currently being displayed. This way is very hackish.
    // TODO: this doesn't need to be a view-layer static function
    formatModelName: function (modelType) {
      if (modelType && modelType.indexOf("Info") >= 0) {
        modelType = modelType.substring(0, modelType.length - 4);
      }
      if (modelType && modelType.indexOf("XM") >= 0) {
        modelType = modelType.substring(3);
      }
      return modelType;
    }
  });

  XV.util = new XV.Util();

}());

