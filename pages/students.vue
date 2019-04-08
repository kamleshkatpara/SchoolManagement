<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Students</v-toolbar-title>
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
      :items="students"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.batch_no }}</td>
        <td>{{ props.item.role_no }}</td>
        <td>{{ props.item.gender }}</td>
        <td>{{ props.item.medium }}</td>
        <td>{{ props.item.status }}</td>
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
        { text: 'Batch#', value: 'batch_no' },
        { text: 'Roll#', value: 'role_no' },
        { text: 'Gender', value: 'gender' },
        { text: 'Medium', value: 'medium' },
        { text: 'Status', value: 'status' },
        { text: 'Created', value: 'created_at' },
        { text: 'Updated', value: 'updated_at' },
        { text: 'Actions', value: 'id', sortable: false }
      ],
      students: [],
      editedIndex: -1,
      editedItem: {
        batch_no: 0,
        role_no: 0,
        date_of_joining: '',
        gender: '',
        medium: '',
        father_name: '',
        father_occupation: '',
        father_phone_number: '',
        mother_name: '',
        mother_occupation: '',
        mother_phone_number: '',
        address: '',
        locality: '',
        area: '',
        city: '',
        no_of_siblings: 0,
        shoe_size: 0,
        shirt_size: 0,
        status: '',
        created_at: '',
        updated_at: '',
        deleted_at: ''
      },
      defaultItem: {
        id: 0,
        batch_no: 0,
        role_no: 0,
        date_of_joining: '',
        gender: '',
        medium: '',
        status: '',
        created_at: '',
        updated_at: '',
        deleted_at: ''
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
        this.students = [
          {
            id: 1,
            batch_no: 123,
            role_no: 321,
            date_of_joining: '28/01/1990',
            gender: 'M',
            medium: 'English',
            father_name: 'John',
            father_occupation: 'Engineer',
            father_phone_number: '9876543210',
            mother_name: 'Marie',
            mother_occupation: 'Architect',
            mother_phone_number: '0123456789',
            address: 'JW Park',
            locality: 'Mumbai',
            area: 'Andheri',
            city: 'Mumbai',
            no_of_siblings: 2,
            shoe_size: 7,
            shirt_size: 12,
            status: 'active',
            created_at: '09/04/2019',
            updated_at: '10/04/2019',
            deleted_at: '11/04/2019'
          },
          {
            id: 2,
            batch_no: 223,
            role_no: 421,
            date_of_joining: '28/01/1995',
            gender: 'F',
            medium: 'Hindi',
            father_name: 'Santosh',
            father_occupation: 'Tailer',
            father_phone_number: '9876543210',
            mother_name: 'Malti',
            mother_occupation: 'Architect',
            mother_phone_number: '0123456789',
            address: 'JW Park',
            locality: 'Mumbai',
            area: 'Goregaon',
            city: 'Mumbai',
            no_of_siblings: 3,
            shoe_size: 7,
            shirt_size: 12,
            status: 'active',
            created_at: '09/04/2019',
            updated_at: '10/04/2019',
            deleted_at: '11/04/2019'
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.students.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.students.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.students.splice(index, 1)
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
          Object.assign(this.students[this.editedIndex], this.editedItem)
        } else {
          this.students.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>