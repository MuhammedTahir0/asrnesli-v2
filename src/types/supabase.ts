export type Json =
     | string
     | number
     | boolean
     | null
     | { [key: string]: Json | undefined }
     | Json[]

export type Database = {
     public: {
          Tables: {
               categories: {
                    Row: {
                         created_at: string
                         icon: string | null
                         id: string
                         name: string
                         slug: string
                    }
                    Insert: {
                         created_at?: string
                         icon?: string | null
                         id?: string
                         name: string
                         slug: string
                    }
                    Update: {
                         created_at?: string
                         icon?: string | null
                         id?: string
                         name?: string
                         slug?: string
                    }
                    Relationships: []
               }
               daily_content: {
                    Row: {
                         created_at: string
                         display_date: string
                         hadith_id: string | null
                         id: string
                         ilmihal_id: string | null
                         name_of_allah_id: string | null
                         verse_id: string | null
                    }
                    Insert: {
                         created_at?: string
                         display_date?: string
                         hadith_id?: string | null
                         id?: string
                         ilmihal_id?: string | null
                         name_of_allah_id?: string | null
                         verse_id?: string | null
                    }
                    Update: {
                         created_at?: string
                         display_date?: string
                         hadith_id?: string | null
                         id?: string
                         ilmihal_id?: string | null
                         name_of_allah_id?: string | null
                         verse_id?: string | null
                    }
                    Relationships: [
                         {
                              foreignKeyName: "daily_content_hadith_id_fkey"
                              columns: ["hadith_id"]
                              isOneToOne: false
                              referencedRelation: "hadiths"
                              referencedColumns: ["id"]
                         },
                         {
                              foreignKeyName: "daily_content_ilmihal_id_fkey"
                              columns: ["ilmihal_id"]
                              isOneToOne: false
                              referencedRelation: "ilmihals"
                              referencedColumns: ["id"]
                         },
                         {
                              foreignKeyName: "daily_content_name_of_allah_id_fkey"
                              columns: ["name_of_allah_id"]
                              isOneToOne: false
                              referencedRelation: "names_of_allah"
                              referencedColumns: ["id"]
                         },
                         {
                              foreignKeyName: "daily_content_verse_id_fkey"
                              columns: ["verse_id"]
                              isOneToOne: false
                              referencedRelation: "verses"
                              referencedColumns: ["id"]
                         },
                    ]
               }
               hadiths: {
                    Row: {
                         category_id: string | null
                         content: string
                         created_at: string
                         id: string
                         source: string | null
                    }
                    Insert: {
                         category_id?: string | null
                         content: string
                         created_at?: string
                         id?: string
                         source?: string | null
                    }
                    Update: {
                         category_id?: string | null
                         content?: string
                         created_at?: string
                         id?: string
                         source?: string | null
                    }
                    Relationships: [
                         {
                              foreignKeyName: "hadiths_category_id_fkey"
                              columns: ["category_id"]
                              isOneToOne: false
                              referencedRelation: "categories"
                              referencedColumns: ["id"]
                         },
                    ]
               }
               ilmihals: {
                    Row: {
                         answer: string
                         category_id: string | null
                         created_at: string
                         id: string
                         question: string
                    }
                    Insert: {
                         answer: string
                         category_id?: string | null
                         created_at?: string
                         id?: string
                         question: string
                    }
                    Update: {
                         answer?: string
                         category_id?: string | null
                         created_at?: string
                         id?: string
                         question?: string
                    }
                    Relationships: [
                         {
                              foreignKeyName: "ilmihals_category_id_fkey"
                              columns: ["category_id"]
                              isOneToOne: false
                              referencedRelation: "categories"
                              referencedColumns: ["id"]
                         },
                    ]
               }
               names_of_allah: {
                    Row: {
                         created_at: string
                         description: string | null
                         id: string
                         meaning: string
                         name_ar: string
                         name_tr: string
                    }
                    Insert: {
                         created_at?: string
                         description?: string | null
                         id?: string
                         meaning: string
                         name_ar: string
                         name_tr: string
                    }
                    Update: {
                         created_at?: string
                         description?: string | null
                         id?: string
                         meaning?: string
                         name_ar?: string
                         name_tr?: string
                    }
                    Relationships: []
               }
               verses: {
                    Row: {
                         content_ar: string
                         content_tr: string
                         created_at: string
                         id: string
                         surah_name: string
                         surah_number: number | null
                         tafsir: string | null
                         verse_number: number | null
                    }
                    Insert: {
                         content_ar: string
                         content_tr: string
                         created_at?: string
                         id?: string
                         surah_name: string
                         surah_number?: number | null
                         tafsir?: string | null
                         verse_number?: number | null
                    }
                    Update: {
                         content_ar?: string
                         content_tr?: string
                         created_at?: string
                         id?: string
                         surah_name?: string
                         surah_number?: number | null
                         tafsir?: string | null
                         verse_number?: number | null
                    }
                    Relationships: []
               }
          }
          Views: {
               [_ in never]: never
          }
          Functions: {
               [_ in never]: never
          }
          Enums: {
               [_ in never]: never
          }
          CompositeTypes: {
               [_ in never]: never
          }
     }
}
