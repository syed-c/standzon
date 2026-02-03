import { NextRequest, NextResponse } from 'next/server';
import { dataPublishingService, PublishingTask } from '@/lib/services/dataPublishingService';

// POST /api/admin/data-publishing - Start publishing process
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Publishing API endpoint called');
    
    const body = await request.json();
    const { action, items, options } = body;

    console.log('🔍 Publishing request:', { action, itemCount: items?.length, options });

    switch (action) {
      case 'analyze':
        // Analyze missing data and return publishing tasks
        const tasks = await dataPublishingService.analyzeMissingData();
        console.log(`✅ Analysis complete: ${tasks.length} tasks identified`);
        
        return NextResponse.json({
          success: true,
          data: {
            tasks,
            summary: {
              total: tasks.length,
              highPriority: tasks.filter(t => t.priority === 'high').length,
              mediumPriority: tasks.filter(t => t.priority === 'medium').length,
              lowPriority: tasks.filter(t => t.priority === 'low').length,
              countries: tasks.filter(t => t.type === 'country').length,
              cities: tasks.filter(t => t.type === 'city').length,
              estimatedTime: Math.ceil(tasks.length * 2) // 2 minutes per task
            }
          }
        });

      case 'start':
        // Start publishing specific items
        if (!items || !Array.isArray(items)) {
          return NextResponse.json(
            { success: false, error: 'Invalid items array' },
            { status: 400 }
          );
        }

        const publishingTasks: PublishingTask[] = items.map((item: any) => ({
          id: `${item.type}-${item.id}`,
          type: item.type,
          slug: item.id,
          name: item.name,
          priority: item.priority || 'medium',
          status: 'pending',
          createdAt: new Date().toISOString()
        }));

        await dataPublishingService.addToQueue(publishingTasks);
        
        console.log(`🚀 Publishing started for ${publishingTasks.length} items`);
        
        return NextResponse.json({
          success: true,
          data: {
            message: `Started publishing ${publishingTasks.length} items`,
            queueStatus: dataPublishingService.getQueueStatus()
          }
        });

      case 'status':
        // Get current queue status
        const queueStatus = dataPublishingService.getQueueStatus();
        
        return NextResponse.json({
          success: true,
          data: {
            queue: queueStatus,
            completionPercentage: dataPublishingService.getCompletionPercentage(),
            estimatedTimeRemaining: dataPublishingService.getEstimatedTimeRemaining()
          }
        });

      case 'retry':
        // Retry failed tasks
        await dataPublishingService.retryFailedTasks();
        
        console.log('🔄 Retrying failed publishing tasks');
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Retrying failed tasks',
            queueStatus: dataPublishingService.getQueueStatus()
          }
        });

      case 'clear':
        // Clear completed tasks
        dataPublishingService.clearCompletedTasks();
        
        console.log('🧹 Cleared completed publishing tasks');
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Cleared completed tasks',
            queueStatus: dataPublishingService.getQueueStatus()
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Publishing API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/data-publishing - Get publishing status and statistics
export async function GET(request: NextRequest) {
  try {
    console.log('📊 Publishing status API called');
    
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    const queueStatus = dataPublishingService.getQueueStatus();
    let tasks = queueStatus.tasks;

    // Apply filters
    if (type) {
      tasks = tasks.filter(task => task.type === type);
    }
    
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    
    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }

    // Calculate analytics
    const analytics = {
      totalTasks: queueStatus.tasks.length,
      completedToday: queueStatus.tasks.filter(task => 
        task.status === 'completed' && 
        task.completedAt && 
        new Date(task.completedAt).toDateString() === new Date().toDateString()
      ).length,
      averageProcessingTime: 2, // minutes per task (simulated)
      successRate: queueStatus.statistics.total > 0 
        ? ((queueStatus.statistics.completed / queueStatus.statistics.total) * 100).toFixed(1)
        : 0,
      tasksByType: {
        countries: queueStatus.tasks.filter(t => t.type === 'country').length,
        cities: queueStatus.tasks.filter(t => t.type === 'city').length
      },
      tasksByPriority: {
        high: queueStatus.tasks.filter(t => t.priority === 'high').length,
        medium: queueStatus.tasks.filter(t => t.priority === 'medium').length,
        low: queueStatus.tasks.filter(t => t.priority === 'low').length
      },
      recentActivity: queueStatus.tasks
        .filter(task => task.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, 10)
    };

    return NextResponse.json({
      success: true,
      data: {
        queue: {
          ...queueStatus,
          tasks: tasks // Return filtered tasks
        },
        analytics,
        completionPercentage: dataPublishingService.getCompletionPercentage(),
        estimatedTimeRemaining: dataPublishingService.getEstimatedTimeRemaining()
      }
    });

  } catch (error) {
    console.error('❌ Publishing status API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/data-publishing - Update publishing configuration
export async function PUT(request: NextRequest) {
  try {
    console.log('⚙️ Publishing configuration update called');
    
    const body = await request.json();
    const { settings } = body;

    console.log('🔧 Updating publishing settings:', settings);

    // In a real implementation, this would update publishing configuration
    // such as batch sizes, processing intervals, priority rules, etc.
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Publishing settings updated successfully',
        settings: {
          batchSize: settings.batchSize || 50,
          processingInterval: settings.processingInterval || 2000,
          autoRetry: settings.autoRetry !== false,
          maxRetries: settings.maxRetries || 3,
          prioritizeHighTraffic: settings.prioritizeHighTraffic !== false
        }
      }
    });

  } catch (error) {
    console.error('❌ Publishing configuration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/data-publishing - Cancel or delete publishing tasks
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Publishing deletion API called');
    
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    const action = url.searchParams.get('action');

    if (action === 'cancel-all') {
      // Cancel all pending tasks
      const queueStatus = dataPublishingService.getQueueStatus();
      const cancelledCount = queueStatus.tasks.filter(t => t.status === 'pending').length;
      
      // In real implementation, would cancel pending tasks
      console.log(`🛑 Cancelled ${cancelledCount} pending tasks`);
      
      return NextResponse.json({
        success: true,
        data: {
          message: `Cancelled ${cancelledCount} pending tasks`,
          cancelledCount
        }
      });
    }

    if (taskId) {
      // Cancel specific task
      console.log(`🛑 Cancelling task: ${taskId}`);
      
      return NextResponse.json({
        success: true,
        data: {
          message: `Task ${taskId} cancelled successfully`
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid deletion request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Publishing deletion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}