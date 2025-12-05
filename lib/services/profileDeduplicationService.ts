// Profile Deduplication Service
// Prevents duplicate builder profiles and merges existing ones

import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

interface DuplicationCheck {
  isDuplicate: boolean;
  existingProfileId?: string;
  matchReason?: string;
  confidence: number;
}

interface MergeResult {
  success: boolean;
  mergedProfileId: string;
  removedProfileIds: string[];
  mergedData: any;
  errors?: string[];
}

export class ProfileDeduplicationService {
  
  /**
   * Check if a new builder profile is a duplicate
   */
  static async checkForDuplicates(newBuilderData: any): Promise<DuplicationCheck> {
    console.log('🔍 Checking for duplicate profiles:', newBuilderData.companyName);
    
    const existingBuilders = unifiedPlatformAPI.getBuilders();
    
    for (const existingBuilder of existingBuilders) {
      const duplicateCheck = this.compareBuildersForDuplication(newBuilderData, existingBuilder);
      
      if (duplicateCheck.isDuplicate) {
        console.log(`⚠️ Duplicate detected: ${duplicateCheck.matchReason} (${duplicateCheck.confidence}% confidence)`);
        return duplicateCheck;
      }
    }
    
    console.log('✅ No duplicates found');
    return {
      isDuplicate: false,
      confidence: 0
    };
  }

  /**
   * Compare two builders for potential duplication
   */
  private static compareBuildersForDuplication(builder1: any, builder2: any): DuplicationCheck {
    let confidence = 0;
    const reasons: string[] = [];

    // Exact company name match (high confidence)
    if (this.normalizeCompanyName(builder1.companyName) === this.normalizeCompanyName(builder2.companyName)) {
      confidence += 60;
      reasons.push('Company name match');
    }

    // Similar company name (medium confidence)
    else if (this.calculateStringSimilarity(builder1.companyName, builder2.companyName) > 0.8) {
      confidence += 40;
      reasons.push('Similar company name');
    }

    // Email match (very high confidence)
    if (builder1.contactEmail?.toLowerCase() === builder2.contactEmail?.toLowerCase()) {
      confidence += 80;
      reasons.push('Email match');
    }

    // Phone match (high confidence)
    if (builder1.contactPhone && builder2.contactPhone) {
      const phone1 = this.normalizePhoneNumber(builder1.contactPhone);
      const phone2 = this.normalizePhoneNumber(builder2.contactPhone);
      if (phone1 === phone2) {
        confidence += 70;
        reasons.push('Phone match');
      }
    }

    // Website match (high confidence)
    if (builder1.website && builder2.website) {
      const website1 = this.normalizeWebsite(builder1.website);
      const website2 = this.normalizeWebsite(builder2.website);
      if (website1 === website2) {
        confidence += 70;
        reasons.push('Website match');
      }
    }

    // Address similarity (medium confidence)
    if (builder1.headquarters && builder2.headquarters) {
      const addressSimilarity = this.compareAddresses(builder1.headquarters, builder2.headquarters);
      if (addressSimilarity > 0.8) {
        confidence += 30;
        reasons.push('Address similarity');
      }
    }

    // GMB Place ID match (very high confidence)
    if (builder1.gmbPlaceId && builder2.gmbPlaceId && builder1.gmbPlaceId === builder2.gmbPlaceId) {
      confidence += 90;
      reasons.push('GMB Place ID match');
    }

    // Registration number match (very high confidence)
    if (builder1.registrationNumber && builder2.registrationNumber && 
        builder1.registrationNumber === builder2.registrationNumber) {
      confidence += 85;
      reasons.push('Registration number match');
    }

    const isDuplicate = confidence >= 75; // 75% confidence threshold

    return {
      isDuplicate,
      existingProfileId: isDuplicate ? builder2.id : undefined,
      matchReason: reasons.join(', '),
      confidence
    };
  }

  /**
   * Merge duplicate profiles
   */
  static async mergeDuplicateProfiles(primaryProfileId: string, duplicateProfileIds: string[]): Promise<MergeResult> {
    console.log('🔄 Merging duplicate profiles:', { primaryProfileId, duplicateProfileIds });
    
    try {
      const builders = unifiedPlatformAPI.getBuilders();
      
      // Get primary profile
      const primaryProfile = builders.find(b => b.id === primaryProfileId);
      if (!primaryProfile) {
        return {
          success: false,
          mergedProfileId: '',
          removedProfileIds: [],
          mergedData: null,
          errors: ['Primary profile not found']
        };
      }

      // Get duplicate profiles
      const duplicateProfiles = builders.filter(b => duplicateProfileIds.includes(b.id));
      
      // Merge data intelligently
      const mergedData = this.mergeBuilderData(primaryProfile, duplicateProfiles);
      
      // Update primary profile with merged data
      const updateResult = unifiedPlatformAPI.updateBuilder(primaryProfileId, mergedData);
      
      if (!updateResult.success) {
        return {
          success: false,
          mergedProfileId: primaryProfileId,
          removedProfileIds: [],
          mergedData: null,
          errors: ['Failed to update primary profile']
        };
      }

      // Remove duplicate profiles
      const removedIds: string[] = [];
      const errors: string[] = [];
      
      for (const duplicateId of duplicateProfileIds) {
        const deleteResult = unifiedPlatformAPI.deleteBuilder(duplicateId);
        if (deleteResult.success) {
          removedIds.push(duplicateId);
          console.log(`✅ Removed duplicate profile: ${duplicateId}`);
        } else {
          errors.push(`Failed to remove profile ${duplicateId}: ${deleteResult.error}`);
        }
      }

      // Update any lead assignments that referenced duplicate profiles
      await this.updateLeadAssignments(duplicateProfileIds, primaryProfileId);
      
      console.log(`✅ Profile merge completed: ${removedIds.length} duplicates removed`);
      
      return {
        success: true,
        mergedProfileId: primaryProfileId,
        removedProfileIds: removedIds,
        mergedData,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('❌ Profile merge failed:', error);
      return {
        success: false,
        mergedProfileId: primaryProfileId,
        removedProfileIds: [],
        mergedData: null,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Intelligently merge builder data from multiple profiles
   */
  private static mergeBuilderData(primary: any, duplicates: any[]): any {
    console.log('🧠 Merging builder data intelligently...');
    
    const merged = { ...primary };
    
    // Merge arrays (services, certifications, etc.)
    const arrayFields = ['services', 'certifications', 'awards', 'languages', 'serviceLocations', 'tradeshowExperience'];
    
    arrayFields.forEach(field => {
      if (merged[field]) {
        duplicates.forEach(dup => {
          if (dup[field] && Array.isArray(dup[field])) {
            merged[field] = this.mergeUniqueArrays(merged[field], dup[field]);
          }
        });
      }
    });

    // Take best values for numeric fields
    const numericFields = ['rating', 'reviewCount', 'projectsCompleted', 'teamSize'];
    
    numericFields.forEach(field => {
      duplicates.forEach(dup => {
        if (dup[field] && dup[field] > (merged[field] || 0)) {
          merged[field] = dup[field];
        }
      });
    });

    // Merge contact information (take non-empty values)
    const contactFields = ['contactPhone', 'website', 'contactEmail'];
    
    contactFields.forEach(field => {
      duplicates.forEach(dup => {
        if (dup[field] && !merged[field]) {
          merged[field] = dup[field];
        }
      });
    });

    // Merge portfolio (combine unique items)
    if (merged.portfolio) {
      duplicates.forEach(dup => {
        if (dup.portfolio && Array.isArray(dup.portfolio)) {
          merged.portfolio = this.mergeUniqueArrays(merged.portfolio, dup.portfolio, 'title');
        }
      });
    }

    // Take the best description (longest one)
    duplicates.forEach(dup => {
      if (dup.description && dup.description.length > (merged.description?.length || 0)) {
        merged.description = dup.description;
      }
    });

    // Preserve important metadata
    merged.mergedProfiles = [
      ...(merged.mergedProfiles || []),
      ...duplicates.map(d => ({
        id: d.id,
        companyName: d.companyName,
        mergedAt: new Date().toISOString()
      }))
    ];

    merged.updatedAt = new Date().toISOString();

    return merged;
  }

  /**
   * Update lead assignments after profile merge
   */
  private static async updateLeadAssignments(duplicateIds: string[], primaryId: string): Promise<void> {
    console.log('🔄 Updating lead assignments after profile merge...');
    
    const leads = unifiedPlatformAPI.getLeads();
    
    for (const lead of leads) {
      let updated = false;
      const updatedLead = { ...lead };
      
      // Update assignedBuilders array
      if (updatedLead.assignedBuilders) {
        updatedLead.assignedBuilders = updatedLead.assignedBuilders.map((builderId: string) => {
          if (duplicateIds.includes(builderId)) {
            updated = true;
            return primaryId;
          }
          return builderId;
        });
        
        // Remove duplicates
        updatedLead.assignedBuilders = [...new Set(updatedLead.assignedBuilders)];
      }
      
      // Update builderEmails array if exists
      if (updatedLead.builderEmails && Array.isArray(updatedLead.builderEmails)) {
        // This is more complex as we need builder email mapping
        // For now, we'll let the system re-populate this
      }
      
      if (updated) {
        unifiedPlatformAPI.updateLead(lead.id, updatedLead);
        console.log(`✅ Updated lead assignments for lead: ${lead.id}`);
      }
    }
  }

  /**
   * Find and merge all duplicates automatically
   */
  static async findAndMergeAllDuplicates(): Promise<{
    duplicatesFound: number;
    mergesCompleted: number;
    errors: string[];
  }> {
    console.log('🔍 Scanning for all duplicate profiles...');
    
    const builders = unifiedPlatformAPI.getBuilders();
    const duplicateGroups: { [primaryId: string]: string[] } = {};
    const processed = new Set<string>();
    const errors: string[] = [];
    
    // Find all duplicate groups
    for (let i = 0; i < builders.length; i++) {
      const builder1 = builders[i];
      if (processed.has(builder1.id)) continue;
      
      const duplicates: string[] = [];
      
      for (let j = i + 1; j < builders.length; j++) {
        const builder2 = builders[j];
        if (processed.has(builder2.id)) continue;
        
        const check = this.compareBuildersForDuplication(builder1, builder2);
        if (check.isDuplicate) {
          duplicates.push(builder2.id);
          processed.add(builder2.id);
        }
      }
      
      if (duplicates.length > 0) {
        duplicateGroups[builder1.id] = duplicates;
      }
      
      processed.add(builder1.id);
    }
    
    console.log(`📊 Found ${Object.keys(duplicateGroups).length} duplicate groups`);
    
    // Merge each group
    let mergesCompleted = 0;
    const totalDuplicates = Object.values(duplicateGroups).reduce((sum, dups) => sum + dups.length, 0);
    
    for (const [primaryId, duplicateIds] of Object.entries(duplicateGroups)) {
      try {
        const result = await this.mergeDuplicateProfiles(primaryId, duplicateIds);
        if (result.success) {
          mergesCompleted++;
          console.log(`✅ Merged group: ${primaryId} absorbed ${duplicateIds.length} duplicates`);
        } else {
          errors.push(`Failed to merge group ${primaryId}: ${result.errors?.join(', ')}`);
        }
      } catch (error) {
        errors.push(`Error merging group ${primaryId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log(`✅ Deduplication complete: ${mergesCompleted}/${Object.keys(duplicateGroups).length} groups merged`);
    
    return {
      duplicatesFound: totalDuplicates,
      mergesCompleted,
      errors
    };
  }

  // Helper methods
  private static normalizeCompanyName(name: string): string {
    return name?.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim() || '';
  }

  private static normalizePhoneNumber(phone: string): string {
    return phone?.replace(/[^\d]/g, '') || '';
  }

  private static normalizeWebsite(website: string): string {
    return website?.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '') || '';
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    const distance = matrix[len2][len1];
    return 1 - distance / Math.max(len1, len2);
  }

  private static compareAddresses(addr1: any, addr2: any): number {
    if (!addr1 || !addr2) return 0;
    
    const addr1Str = `${addr1.address || ''} ${addr1.city || ''} ${addr1.country || ''}`.toLowerCase();
    const addr2Str = `${addr2.address || ''} ${addr2.city || ''} ${addr2.country || ''}`.toLowerCase();
    
    return this.calculateStringSimilarity(addr1Str, addr2Str);
  }

  private static mergeUniqueArrays(arr1: any[], arr2: any[], uniqueKey?: string): any[] {
    if (!arr1 || !arr2) return arr1 || arr2 || [];
    
    const merged = [...arr1];
    
    arr2.forEach(item => {
      const exists = uniqueKey 
        ? merged.some(existing => existing[uniqueKey] === item[uniqueKey])
        : merged.some(existing => JSON.stringify(existing) === JSON.stringify(item));
      
      if (!exists) {
        merged.push(item);
      }
    });
    
    return merged;
  }
}

export default ProfileDeduplicationService;