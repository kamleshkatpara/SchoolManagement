<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Assignments</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="assignments"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.total_score }}</td>
        <td>{{ props.item.parent_assignment_id }}</td>
        <td>{{ props.item.created_at }}</td>
        <td>{{ props.item.updated_at }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>


<script>
  export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Total Score', value: 'total_score' },
        { text: 'Parent ID', value: 'parent_assignment_id' },
        { text: 'Create Date', value: 'created_at' },
        { text: 'Updated Date', value: 'updated_at' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      assignments: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        type: '',
        total_score: '',
        parent_assignment_id: ''
      },
      defaultItem: {
        name: '',
        type: '',
        total_score: '',
        parent_assignment_id: ''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.assignments = [
          {
            id: 1,
            name: 'Hello',
            type: 'baseline',
            total_score: 100,
            parent_assignment_id: '',
            created_at: '09/04/2019',
            updated_at: '10/04/2019'
          },
          {
            id: 1,
            name: 'World',
            type: 'midline',
            total_score: 200,
            parent_assignment_id: '',
            created_at: '09/04/2019',
            updated_at: '10/04/2019'
          },
          {
            id: 1,
            name: 'Technology',
            type: 'endline',
            total_score: 300,
            parent_assignment_id: '',
            created_at: '09/04/2019',
            updated_at: '10/04/2019'
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.assignments.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.assignments.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.assignments.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.assignments[this.editedIndex], this.editedItem)
        } else {
          this.assignments.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>