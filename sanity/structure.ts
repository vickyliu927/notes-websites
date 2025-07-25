import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Old Files Section - for documents starting with "Online" and ending with "Tutor"
      S.listItem()
        .title('🗂️ Old Files')
        .child(
          S.documentTypeList('subjectPage')
            .title('Old Files')
            .filter('_type == "subjectPage" && title match "Online*" && title match "*Tutor"')
        ),

      // CIE IGCSE Notes Section (moved to root level)
      S.listItem()
        .title('CIE IGCSE Notes')
        .child(
          S.list()
            .title('CIE IGCSE Content')
            .items([
              // Homepage Section
              S.listItem()
                .title('Homepage')
                .child(
                  S.list()
                    .title('Homepage Sections')
                    .items([
                      // Hero Section
                      S.listItem()
                        .title('Hero Section')
                        .child(
                          S.documentTypeList('hero')
                            .title('Hero Section')
                            .filter('_type == "hero" && !defined(cloneReference)')
                        ),
                      
                      // Subject Grid Section
                      S.listItem()
                        .title('Subject Grid Section')
                        .child(
                          S.documentTypeList('subjectGrid')
                            .title('Subject Grid Section')
                            .filter('_type == "subjectGrid" && !defined(cloneReference)')
                        ),
                      
                      // Subject Request Section
                      S.listItem()
                        .title('Subject Request Section')
                        .child(
                          S.documentTypeList('subjectRequest')
                            .title('Subject Request Section')
                            .filter('_type == "subjectRequest"')
                        ),
                      
                      // Why Choose Us Section
                      S.listItem()
                        .title('Why Choose Us Section')
                        .child(
                          S.documentTypeList('whyChooseUs')
                            .title('Why Choose Us Section')
                            .filter('_type == "whyChooseUs" && !defined(cloneReference)')
                        ),
                      
                      // FAQ Section
                      S.listItem()
                        .title('FAQ Section')
                        .child(
                          S.documentTypeList('faq')
                            .title('FAQ Section')
                            .filter('_type == "faq" && !defined(cloneReference)')
                        ),
                      
                      // Contact Form Section
                      S.listItem()
                        .title('Contact Form Section')
                        .child(
                          S.documentTypeList('contactFormSection')
                            .title('Contact Form Section')
                            .filter('_type == "contactFormSection" && !defined(cloneReference)')
                        ),
                      
                      // Contact Form Submissions
                      S.listItem()
                        .title('Contact Form Submissions')
                        .child(
                          S.documentTypeList('contactForm')
                            .title('Contact Form Submissions')
                            .filter('_type == "contactForm"')
                        ),
                      
                      // SEO Settings
                      S.listItem()
                        .title('SEO Settings')
                        .child(
                          S.documentTypeList('homepageSEO')
                            .title('SEO Settings')
                            .filter('_type == "homepageSEO"')
                        ),
                    ])
                ),
              
              // Subject Pages
              S.listItem()
                .title('Subject Pages')
                .child(
                  S.documentTypeList('subjectPage')
                    .title('Subject Pages')
                    .filter('_type == "subjectPage" && !defined(cloneReference) && !(title match "Online*" && title match "*Tutor")')
                ),
              
              // Header
              S.listItem()
                .title('Header')
                .child(
                  S.documentTypeList('header')
                    .title('Header')
                    .filter('_type == "header" && !defined(cloneReference)')
                ),
              
              // Footer
              S.listItem()
                .title('Footer')
                .child(
                  S.documentTypeList('footer')
                    .title('Footer')
                    .filter('_type == "footer" && !defined(cloneReference)')
                ),
              

            ])
        ),



      // Clone Management Section
      S.listItem()
        .title('🔗 Clone Management')
        .child(
          S.list()
            .title('Clone Management')
            .items([
              // All Clones
              S.listItem()
                .title('All Clones')
                .child(
                  S.documentTypeList('clone')
                    .title('All Clones')
                    .filter('_type == "clone"')
                ),
              
              // Active Clones
              S.listItem()
                .title('Active Clones')
                .child(
                  S.documentTypeList('clone')
                    .title('Active Clones')
                    .filter('_type == "clone" && isActive == true')
                ),
              
              // Inactive Clones
              S.listItem()
                .title('Inactive Clones')
                .child(
                  S.documentTypeList('clone')
                    .title('Inactive Clones')
                    .filter('_type == "clone" && isActive == false')
                ),

              // Clone-Specific Content Management - Organized by Clone Name
              S.listItem()
                .title('📝 Clone Content Manager')
                .child(
                  S.list()
                    .title('Clone Content Manager')
                    .items([


                      // All Clone Content By Website
                      S.listItem()
                        .title('📋 All Clone Content By Website')
                        .child(
                          S.documentTypeList('clone')
                            .title('All Clone Content By Website')
                            .filter('_type == "clone"')
                            .child((cloneId: string) =>
                              S.list()
                                .title('Clone Content')
                                .items([
                                  // Homepage Configuration for this specific clone
                                  S.listItem()
                                    .title('📋 Homepage Configuration')
                                    .child(
                                      S.documentTypeList('homepage')
                                        .title('Homepage Configuration')
                                        .filter(`_type == "homepage" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('🔝 Header')
                                    .child(
                                      S.documentTypeList('header')
                                        .title('Headers')
                                        .filter(`_type == "header" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('🎯 Hero Section')
                                    .child(
                                      S.documentTypeList('hero')
                                        .title('Hero Sections')
                                        .filter(`_type == "hero" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('📊 Subject Grid')
                                    .child(
                                      S.documentTypeList('subjectGrid')
                                        .title('Subject Grids')
                                        .filter(`_type == "subjectGrid" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('⭐ Why Choose Us')
                                    .child(
                                      S.documentTypeList('whyChooseUs')
                                        .title('Why Choose Us')
                                        .filter(`_type == "whyChooseUs" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('❓ FAQ Section')
                                    .child(
                                      S.documentTypeList('faq')
                                        .title('FAQ Sections')
                                        .filter(`_type == "faq" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('📞 Contact Form')
                                    .child(
                                      S.documentTypeList('contactFormSection')
                                        .title('Contact Forms')
                                        .filter(`_type == "contactFormSection" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                  S.listItem()
                                    .title('🔽 Footer')
                                    .child(
                                      S.documentTypeList('footer')
                                        .title('Footers')
                                        .filter(`_type == "footer" && cloneReference._ref == "${cloneId}"`)
                                    ),

                                  // Subject Pages for this specific clone
                                  S.listItem()
                                    .title('📚 Subject Pages')
                                    .child(
                                      S.documentTypeList('subjectPage')
                                        .title('Subject Pages')
                                        .filter(`_type == "subjectPage" && cloneReference._ref == "${cloneId}" && !(title match "Online*" && title match "*Tutor")`)
                                    ),

                                  // Exam Board Pages for this specific clone
                                  S.listItem()
                                    .title('📖 Exam Board Pages')
                                    .child(
                                      S.documentTypeList('examBoardPage')
                                        .title('Exam Board Pages')
                                        .filter(`_type == "examBoardPage" && cloneReference._ref == "${cloneId}"`)
                                    ),
                                ])
                            )
                        ),

                      // All Clone Content By Section
                      S.listItem()
                        .title('📊 All Clone Content By Section')
                        .child(
                          S.list()
                            .title('All Clone Content By Section')
                            .items([
                              S.listItem()
                                .title('🎯 All Clone Heroes')
                                .child(
                                  S.documentTypeList('hero')
                                    .title('All Clone Heroes')
                                    .filter('_type == "hero" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('📊 All Clone Subject Grids')
                                .child(
                                  S.documentTypeList('subjectGrid')
                                    .title('All Clone Subject Grids')
                                    .filter('_type == "subjectGrid" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('⭐ All Clone Why Choose Us')
                                .child(
                                  S.documentTypeList('whyChooseUs')
                                    .title('All Clone Why Choose Us')
                                    .filter('_type == "whyChooseUs" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('❓ All Clone FAQs')
                                .child(
                                  S.documentTypeList('faq')
                                    .title('All Clone FAQs')
                                    .filter('_type == "faq" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('📚 All Clone Subject Pages')
                                .child(
                                  S.documentTypeList('subjectPage')
                                    .title('All Clone Subject Pages')
                                    .filter('_type == "subjectPage" && defined(cloneReference) && !(title match "Online*" && title match "*Tutor")')
                                ),

                              S.listItem()
                                .title('🔝 All Clone Headers')
                                .child(
                                  S.documentTypeList('header')
                                    .title('All Clone Headers')
                                    .filter('_type == "header" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('🔽 All Clone Footers')
                                .child(
                                  S.documentTypeList('footer')
                                    .title('All Clone Footers')
                                    .filter('_type == "footer" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('📞 All Clone Contact Forms')
                                .child(
                                  S.documentTypeList('contactFormSection')
                                    .title('All Clone Contact Forms')
                                    .filter('_type == "contactFormSection" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('📋 Exam Boards')
                                .child(
                                  S.documentTypeList('examBoard')
                                    .title('Exam Boards')
                                    .filter('_type == "examBoard"')
                                ),
                              S.listItem()
                                .title('📖 All Clone Exam Board Pages (DEPRECATED)')
                                .child(
                                  S.documentTypeList('examBoardPage')
                                    .title('All Clone Exam Board Pages (DEPRECATED)')
                                    .filter('_type == "examBoardPage" && defined(cloneReference)')
                                ),
                            ])
                        ),


                    ])
                ),
            ])
        ),
    ]) 