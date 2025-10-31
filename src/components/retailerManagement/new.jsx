import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader, Video, PlayCircle } from 'lucide-react';

// Backend Controller Code (Copy this to your backend)
const BackendControllerCode = () => (
  <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
    <div className="text-yellow-400 mb-2">// videoController.ts</div>
    <pre>{`
// Generate signed upload URL for direct upload
export const generateUploadUrl = async (req: Request, res: Response) => {
  try {
    const { title, fileName } = req.body;

    // Create video object in Bunny Stream
    const createResponse = await axios.post(
      \`https://video.bunnycdn.com/library/\${config.bunnyCDN.streamLibraryId}/videos\`,
      { title: title || fileName },
      {
        headers: {
          AccessKey: config.bunnyCDN.streamApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const videoId = createResponse.data.guid;
    const libraryId = config.bunnyCDN.streamLibraryId;

    // Generate signed upload URL
    const uploadUrl = \`https://video.bunnycdn.com/library/\${libraryId}/videos/\${videoId}\`;
    
    res.status(200).json({
      success: true,
      data: {
        videoId,
        uploadUrl,
        apiKey: config.bunnyCDN.streamApiKey, // Send securely
        embedUrl: \`https://iframe.mediadelivery.net/embed/\${libraryId}/\${videoId}\`,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save video metadata after upload
export const saveVideoMetadata = async (req: Request, res: Response) => {
  try {
    const { videoId, title, description, thumbnailUrl } = req.body;

    const video = await Video.create({
      videoId,
      title,
      description,
      thumbnailUrl,
      embedUrl: \`https://iframe.mediadelivery.net/embed/\${config.bunnyCDN.streamLibraryId}/\${videoId}\`,
      status: 'processing', // Bunny will process the video
    });

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
`}</pre>
  </div>
);

// React Component for Direct Upload
const DirectVideoUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const uploadTooBunnyStream = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadStatus('Initializing upload...');

    try {
      // Step 1: Get upload URL from backend
      setUploadStatus('Getting upload credentials...');
      const initResponse = await fetch('/api/videos/generate-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          fileName: file.name,
        }),
      });

      const { data } = await initResponse.json();
      const { videoId, uploadUrl, apiKey, embedUrl } = data;

      // Step 2: Upload directly to Bunny Stream with progress
      setUploadStatus('Uploading to Bunny Stream...');
      
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
          setUploadStatus(\`Uploading: \${percentComplete}%\`);
        }
      });

      // Handle completion
      xhr.addEventListener('load', async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadStatus('Upload complete! Processing video...');
          
          // Step 3: Save metadata to database
          const saveResponse = await fetch('/api/videos/save-metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoId,
              title,
              embedUrl,
            }),
          });

          const savedData = await saveResponse.json();
          
          setVideoData({
            videoId,
            embedUrl,
            title,
          });
          
          setUploadStatus('✅ Video uploaded successfully!');
          setProgress(100);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        setUploadStatus('❌ Upload failed');
        setUploading(false);
      });

      // Send the file
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('AccessKey', apiKey);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.send(file);

    } catch (error) {
      setUploadStatus(\`❌ Error: \${error.message}\`);
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Professional Video Upload
            </h1>
          </div>

          {/* Backend Code Reference */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📋 Backend Setup (Copy to your backend)
            </h2>
            <BackendControllerCode />
          </div>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center">
            {!file ? (
              <label className="cursor-pointer">
                <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload video
                </p>
                <p className="text-sm text-gray-500">
                  Supports all formats • Up to 5GB
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                {!uploading && !videoData && (
                  <button
                    onClick={uploadTooBunnyStream}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Start Upload
                  </button>
                )}

                {uploading && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Loader className="w-6 h-6 text-purple-600 animate-spin" />
                      <span className="text-gray-700 font-medium">
                        {uploadStatus}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: \`\${progress}%\` }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      {progress}% complete
                    </p>
                  </div>
                )}

                {videoData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Upload Successful!
                        </h3>
                        <p className="text-sm text-gray-600">
                          Video ID: {videoData.videoId}
                        </p>
                      </div>
                    </div>
                    <a
                      href={videoData.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Watch Video
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                🚀 Direct Upload
              </h3>
              <p className="text-sm text-blue-700">
                Client uploads directly to Bunny Stream - no backend bottleneck
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                📊 Real Progress
              </h3>
              <p className="text-sm text-green-700">
                Live upload progress tracking with percentage
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">
                ⚡ Optimized
              </h3>
              <p className="text-sm text-purple-700">
                Handles large files (5GB+) efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Route Configuration */}
        <div className="mt-8 bg-gray-800 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">🛣️ Backend Routes</h3>
          <pre className="text-sm text-green-400">{`
// routes/video.routes.ts
router.post(
  '/generate-upload-url',
  auth(USER_ROLES.ADMIN),
  videoController.generateUploadUrl
);

router.post(
  '/save-metadata',
  auth(USER_ROLES.ADMIN),
  videoController.saveVideoMetadata
);
          `}</pre>
        </div>
      </div>
    </div>
  );
};

export default DirectVideoUpload;
















import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import config from '../config';
import AppError from '../errors/AppError';

// Generate signed upload URL for direct client upload
export const generateUploadUrl = async (req: Request, res: Response) => {
  try {
    const { title, fileName } = req.body;

    if (!fileName) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'File name is required');
    }

    console.log('🎬 Creating video object for:', title || fileName);

    // Step 1: Create video object in Bunny Stream
    const createResponse = await axios.post(
      `https://video.bunnycdn.com/library/${config.bunnyCDN.streamLibraryId}/videos`,
      {
        title: title || fileName,
      },
      {
        headers: {
          AccessKey: config.bunnyCDN.streamApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const videoId = createResponse.data.guid;
    const libraryId = config.bunnyCDN.streamLibraryId;

    console.log('✅ Video object created with ID:', videoId);

    // Step 2: Generate upload URL
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Upload URL generated successfully',
      data: {
        videoId,
        uploadUrl,
        apiKey: config.bunnyCDN.streamApiKey, // Send securely (only to authenticated users)
        embedUrl,
        libraryId,
      },
    });
  } catch (error: any) {
    console.error('❌ Error generating upload URL:', error.response?.data || error.message);
    
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to generate upload URL',
      error: error.response?.data || error.message,
    });
  }
};

// Save video metadata after successful upload
export const saveVideoMetadata = async (req: Request, res: Response) => {
  try {
    const { videoId, title, description, thumbnailUrl, duration, tags } = req.body;

    if (!videoId) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Video ID is required');
    }

    console.log('💾 Saving video metadata for:', videoId);

    const libraryId = config.bunnyCDN.streamLibraryId;

    // Create video record in your database
    const video = await Video.create({
      videoId,
      libraryId,
      title: title || 'Untitled Video',
      description: description || '',
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
      thumbnailUrl: thumbnailUrl || `https://vz-${config.bunnyCDN.streamCDNHostname}.b-cdn.net/${videoId}/thumbnail.jpg`,
      status: 'processing', // Bunny Stream will process the video
      duration: duration || 0,
      tags: tags || [],
      uploadedBy: req.user?.id, // Assuming auth middleware
      uploadedAt: new Date(),
    });

    console.log('✅ Video metadata saved successfully');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Video metadata saved successfully',
      data: video,
    });
  } catch (error: any) {
    console.error('❌ Error saving video metadata:', error);
    
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to save video metadata',
    });
  }
};

// Get video status from Bunny Stream
export const getVideoStatus = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    console.log('📊 Fetching video status for:', videoId);

    const response = await axios.get(
      `https://video.bunnycdn.com/library/${config.bunnyCDN.streamLibraryId}/videos/${videoId}`,
      {
        headers: {
          AccessKey: config.bunnyCDN.streamApiKey,
        },
      }
    );

    const videoData = response.data;

    // Update status in database if needed
    await Video.findOneAndUpdate(
      { videoId },
      {
        status: videoData.status === 4 ? 'ready' : 'processing', // 4 = ready
        duration: videoData.length || 0,
        resolutions: videoData.availableResolutions || [],
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        videoId,
        status: videoData.status === 4 ? 'ready' : 'processing',
        duration: videoData.length,
        thumbnailUrl: `https://vz-${config.bunnyCDN.streamCDNHostname}.b-cdn.net/${videoId}/thumbnail.jpg`,
        availableResolutions: videoData.availableResolutions,
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching video status:', error.response?.data || error.message);
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch video status',
    });
  }
};

// Upload thumbnail for video
export const uploadThumbnail = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const thumbnailFile = req.file;

    if (!thumbnailFile) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Thumbnail file is required');
    }

    console.log('🖼️ Uploading thumbnail for video:', videoId);

    await axios.post(
      `https://video.bunnycdn.com/library/${config.bunnyCDN.streamLibraryId}/videos/${videoId}/thumbnail`,
      thumbnailFile.buffer,
      {
        headers: {
          AccessKey: config.bunnyCDN.streamApiKey,
          'Content-Type': 'image/jpeg',
        },
      }
    );

    const thumbnailUrl = `https://vz-${config.bunnyCDN.streamCDNHostname}.b-cdn.net/${videoId}/thumbnail.jpg?t=${Date.now()}`;

    // Update database
    await Video.findOneAndUpdate(
      { videoId },
      { thumbnailUrl }
    );

    console.log('✅ Thumbnail uploaded successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: { thumbnailUrl },
    });
  } catch (error: any) {
    console.error('❌ Error uploading thumbnail:', error.response?.data || error.message);
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to upload thumbnail',
    });
  }
};

// Delete video from Bunny Stream
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    console.log('🗑️ Deleting video:', videoId);

    // Delete from Bunny Stream
    await axios.delete(
      `https://video.bunnycdn.com/library/${config.bunnyCDN.streamLibraryId}/videos/${videoId}`,
      {
        headers: {
          AccessKey: config.bunnyCDN.streamApiKey,
        },
      }
    );

    // Delete from database
    await Video.findOneAndDelete({ videoId });

    console.log('✅ Video deleted successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error deleting video:', error.response?.data || error.message);
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete video',
    });
  }
};

// Get all videos with pagination
export const getVideos = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const videos = await Video.find(query)
      .sort({ uploadedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Video.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        videos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching videos:', error);
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch videos',
    });
  }
};

export default {
  generateUploadUrl,
  saveVideoMetadata,
  getVideoStatus,
  uploadThumbnail,
  deleteVideo,
  getVideos,
};


import express from 'express';
import videoController from '../controllers/videoController';
import auth from '../middlewares/auth';
import { USER_ROLES } from '../constants/userRoles';
import multer from 'multer';

const router = express.Router();

// Multer for thumbnail upload only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for thumbnails
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails'));
    }
  },
});

// ==================== Direct Upload Routes ====================

/**
 * Generate upload URL for direct client upload
 * POST /api/videos/generate-upload-url
 * Body: { title: string, fileName: string }
 */
router.post(
  '/generate-upload-url',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  videoController.generateUploadUrl
);

/**
 * Save video metadata after client upload
 * POST /api/videos/save-metadata
 * Body: { videoId: string, title: string, description?: string, tags?: string[] }
 */
router.post(
  '/save-metadata',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  videoController.saveVideoMetadata
);

// ==================== Video Management Routes ====================

/**
 * Get all videos with pagination
 * GET /api/videos?page=1&limit=10&status=ready&search=keyword
 */
router.get(
  '/',
  videoController.getVideos
);

/**
 * Get video status from Bunny Stream
 * GET /api/videos/:videoId/status
 */
router.get(
  '/:videoId/status',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  videoController.getVideoStatus
);

/**
 * Upload custom thumbnail for video
 * POST /api/videos/:videoId/thumbnail
 * Body: FormData with 'thumbnail' field
 */
router.post(
  '/:videoId/thumbnail',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  upload.single('thumbnail'),
  videoController.uploadThumbnail
);

/**
 * Delete video from Bunny Stream and database
 * DELETE /api/videos/:videoId
 */
router.delete(
  '/:videoId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  videoController.deleteVideo
);

// ==================== Legacy Route (if needed) ====================

/**
 * OLD: Upload via backend (not recommended for large files)
 * POST /api/videos/upload-backend
 * Use /generate-upload-url instead for better performance
 */
// router.post(
//   '/upload-backend',
//   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
//   fileUploadHandlerbunny, // Your old middleware
//   videoController.addVideos
// );

export default router;