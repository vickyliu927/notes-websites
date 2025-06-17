import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Notes & Question Bank Section
      S.listItem()
        .title('Notes & Question Bank')
        .child(
          S.list()
            .title('Notes & Question Bank')
            .items([
              // Notes Section
              S.listItem()
                .title('Notes')
                .child(
                  S.list()
                    .title('Notes')
                    .items([
                      // CIE IGCSE Notes Section
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
                                    .filter('_type == "subjectPage" && !defined(cloneReference)')
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
                    ])
                ),
              
              // Question Bank Section (Empty folder for now)
              S.listItem()
                .title('Question Bank')
                .child(
                  S.list()
                    .title('Question Bank')
                    .items([])
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
                      // Test Clone Content
                      S.listItem()
                        .title('🎯 Test Clone')
                        .child(
                          S.list()
                            .title('Test Clone Content')
                            .items([
                              // Homepage folder
                              S.listItem()
                                .title('📄 Homepage')
                                .child(
                                  S.list()
                                    .title('Test Clone Homepage')
                                    .items([
                                      S.listItem()
                                        .title('🔝 Header')
                                        .child(
                                          S.documentTypeList('header')
                                            .title('Test Clone Headers')
                                            .filter('_type == "header" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                      S.listItem()
                                        .title('🎯 Hero Section')
                                        .child(
                                          S.documentTypeList('hero')
                                            .title('Test Clone Heroes')
                                            .filter('_type == "hero" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                      S.listItem()
                                        .title('📊 Subject Grid')
                                        .child(
                                          S.documentTypeList('subjectGrid')
                                            .title('Test Clone Subject Grids')
                                            .filter('_type == "subjectGrid" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                      S.listItem()
                                        .title('⭐ Why Choose Us')
                                        .child(
                                          S.documentTypeList('whyChooseUs')
                                            .title('Test Clone Why Choose Us')
                                            .filter('_type == "whyChooseUs" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                      S.listItem()
                                        .title('❓ FAQ Section')
                                        .child(
                                          S.documentTypeList('faq')
                                            .title('Test Clone FAQs')
                                            .filter('_type == "faq" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                      S.listItem()
                                        .title('📞 Contact Form')
                                        .child(
                                          S.documentTypeList('contactFormSection')
                                            .title('Test Clone Contact Forms')
                                            .filter('_type == "contactFormSection" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                      S.listItem()
                                        .title('🔽 Footer')
                                        .child(
                                          S.documentTypeList('footer')
                                            .title('Test Clone Footers')
                                            .filter('_type == "footer" && cloneReference->cloneId.current == "test-clone"')
                                        ),
                                    ])
                                ),
                              // Subject Pages folder
                              S.listItem()
                                .title('📚 Subject Pages')
                                .child(
                                  S.documentTypeList('subjectPage')
                                    .title('Test Clone Subject Pages')
                                    .filter('_type == "subjectPage" && cloneReference->cloneId.current == "test-clone"')
                                ),
                            ])
                        ),

                      // Clone Test 2 Content
                      S.listItem()
                        .title('🎯 Clone Test 2')
                        .child(
                          S.list()
                            .title('Clone Test 2 Content')
                            .items([
                              // Homepage folder
                              S.listItem()
                                .title('📄 Homepage')
                                .child(
                                  S.list()
                                    .title('Clone Test 2 Homepage')
                                    .items([
                                      S.listItem()
                                        .title('🔝 Header')
                                        .child(
                                          S.documentTypeList('header')
                                            .title('Clone Test 2 Headers')
                                            .filter('_type == "header" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                      S.listItem()
                                        .title('🎯 Hero Section')
                                        .child(
                                          S.documentTypeList('hero')
                                            .title('Clone Test 2 Heroes')
                                            .filter('_type == "hero" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                      S.listItem()
                                        .title('📊 Subject Grid')
                                        .child(
                                          S.documentTypeList('subjectGrid')
                                            .title('Clone Test 2 Subject Grids')
                                            .filter('_type == "subjectGrid" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                      S.listItem()
                                        .title('⭐ Why Choose Us')
                                        .child(
                                          S.documentTypeList('whyChooseUs')
                                            .title('Clone Test 2 Why Choose Us')
                                            .filter('_type == "whyChooseUs" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                      S.listItem()
                                        .title('❓ FAQ Section')
                                        .child(
                                          S.documentTypeList('faq')
                                            .title('Clone Test 2 FAQs')
                                            .filter('_type == "faq" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                      S.listItem()
                                        .title('📞 Contact Form')
                                        .child(
                                          S.documentTypeList('contactFormSection')
                                            .title('Clone Test 2 Contact Forms')
                                            .filter('_type == "contactFormSection" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                      S.listItem()
                                        .title('🔽 Footer')
                                        .child(
                                          S.documentTypeList('footer')
                                            .title('Clone Test 2 Footers')
                                            .filter('_type == "footer" && cloneReference->cloneId.current == "test-2"')
                                        ),
                                    ])
                                ),
                              // Subject Pages folder
                              S.listItem()
                                .title('📚 Subject Pages')
                                .child(
                                  S.documentTypeList('subjectPage')
                                    .title('Clone Test 2 Subject Pages')
                                    .filter('_type == "subjectPage" && cloneReference->cloneId.current == "test-2"')
                                ),
                            ])
                        ),

                      // Quick Create Section for Clone Content
                      S.listItem()
                        .title('⚡ Quick Create Clone Content')
                        .child(
                          S.list()
                            .title('Create New Clone Content')
                            .items([
                              S.listItem()
                                .title('+ New Clone Hero')
                                .child(
                                  S.documentTypeList('hero')
                                    .title('Create Clone Hero')
                                ),
                              S.listItem()
                                .title('+ New Clone Subject Grid')
                                .child(
                                  S.documentTypeList('subjectGrid')
                                    .title('Create Clone Subject Grid')
                                ),
                              S.listItem()
                                .title('+ New Clone Why Choose Us')
                                .child(
                                  S.documentTypeList('whyChooseUs')
                                    .title('Create Clone Why Choose Us')
                                ),
                              S.listItem()
                                .title('+ New Clone FAQ')
                                .child(
                                  S.documentTypeList('faq')
                                    .title('Create Clone FAQ')
                                ),
                              S.listItem()
                                .title('+ New Clone Subject Page')
                                .child(
                                  S.documentTypeList('subjectPage')
                                    .title('Create Clone Subject Page')
                                ),
                              S.listItem()
                                .title('+ New Clone Header')
                                .child(
                                  S.documentTypeList('header')
                                    .title('Create Clone Header')
                                ),
                              S.listItem()
                                .title('+ New Clone Footer')
                                .child(
                                  S.documentTypeList('footer')
                                    .title('Create Clone Footer')
                                ),
                              S.listItem()
                                .title('+ New Clone Contact Form')
                                .child(
                                  S.documentTypeList('contactFormSection')
                                    .title('Create Clone Contact Form')
                                ),
                            ])
                        ),

                      // All Clone Content (Fallback)
                      S.listItem()
                        .title('📋 All Clone Content')
                        .child(
                          S.list()
                            .title('All Clone Content')
                            .items([
                              S.listItem()
                                .title('All Clone Heroes')
                                .child(
                                  S.documentTypeList('hero')
                                    .title('All Clone Heroes')
                                    .filter('_type == "hero" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone Subject Grids')
                                .child(
                                  S.documentTypeList('subjectGrid')
                                    .title('All Clone Subject Grids')
                                    .filter('_type == "subjectGrid" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone Subject Pages')
                                .child(
                                  S.documentTypeList('subjectPage')
                                    .title('All Clone Subject Pages')
                                    .filter('_type == "subjectPage" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone Headers')
                                .child(
                                  S.documentTypeList('header')
                                    .title('All Clone Headers')
                                    .filter('_type == "header" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone Footers')
                                .child(
                                  S.documentTypeList('footer')
                                    .title('All Clone Footers')
                                    .filter('_type == "footer" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone Contact Forms')
                                .child(
                                  S.documentTypeList('contactFormSection')
                                    .title('All Clone Contact Forms')
                                    .filter('_type == "contactFormSection" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone FAQs')
                                .child(
                                  S.documentTypeList('faq')
                                    .title('All Clone FAQs')
                                    .filter('_type == "faq" && defined(cloneReference)')
                                ),
                              S.listItem()
                                .title('All Clone Why Choose Us')
                                .child(
                                  S.documentTypeList('whyChooseUs')
                                    .title('All Clone Why Choose Us')
                                    .filter('_type == "whyChooseUs" && defined(cloneReference)')
                                ),
                            ])
                        ),
                    ])
                ),
            ])
        ),
    ]) 