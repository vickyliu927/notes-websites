import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function updateDomainsProperty() {
  try {
    console.log('=== Updating domains properly for test-clone ===')
    
    // Get the current test-clone document
    const testClone = await client.fetch(`
      *[_type == "clone" && cloneId.current == "test-clone"][0] {
        _id,
        cloneId,
        cloneName,
        isActive,
        metadata
      }
    `)
    
    console.log('Current test-clone data:', JSON.stringify(testClone, null, 2))
    
    if (!testClone) {
      console.log('No test-clone found')
      return
    }
    
    // Create clean metadata with proper domains array
    const cleanMetadata = {
      targetAudience: testClone.metadata?.targetAudience || 'Test Users',
      region: testClone.metadata?.region || 'Test Region',
      domains: [
        "www.igcse-questions.com",
        "igcse-questions.com"
      ]
    }
    
    console.log('Updating with clean metadata:', cleanMetadata)
    
    // Update the document - replace entire metadata to clean up any old fields
    const result = await client
      .patch(testClone._id)
      .set({
        metadata: cleanMetadata
      })
      .commit()
    
    console.log('Update result:', result)
    
    // Verify the update
    const updatedClone = await client.fetch(`
      *[_type == "clone" && cloneId.current == "test-clone"][0] {
        _id,
        cloneId,
        cloneName,
        isActive,
        metadata
      }
    `)
    
    console.log('Updated clone data:', JSON.stringify(updatedClone, null, 2))
    
    // Test the domain queries
    console.log('\n=== Testing domain queries after proper update ===')
    
    const domainTest1 = await client.fetch(`
      *[_type == "clone" && "www.igcse-questions.com" in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `)
    console.log('Query for www.igcse-questions.com:', JSON.stringify(domainTest1, null, 2))
    
    const domainTest2 = await client.fetch(`
      *[_type == "clone" && "igcse-questions.com" in metadata.domains && isActive == true][0] {
        cloneId,
        metadata
      }
    `)
    console.log('Query for igcse-questions.com:', JSON.stringify(domainTest2, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

updateDomainsProperty() 