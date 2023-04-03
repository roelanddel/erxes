import { Model } from 'mongoose';

import { Document, Schema } from 'mongoose';

interface IFolder {
  createdAt: Date;
  createdUserId: string;
  name: string;
  parentId: string;

  permissionUserIds?: string[];
  permissionUnitId?: string;
}

export interface IFolderDocument extends IFolder, Document {
  _id: string;
}

const folderSchema = new Schema({
  createdAt: { type: Date },
  createdUserId: { type: String },
  name: { type: String },
  parentId: { type: String },

  permissionUserIds: { type: [String] },
  permissionUnitId: { type: String }
});

export interface IFolderModel extends Model<IFolderDocument> {
  saveFolder({ _id, doc }): IFolderDocument;
  getFolder(selector): IFolderDocument;
}

export const loadFolderClass = models => {
  class Folder {
    public static async saveFolder({ _id, doc }) {
      if (_id) {
        await models.Folders.update({ _id }, { $set: doc });
        return models.Folders.findOne({ _id });
      }

      doc.createdAt = new Date();

      return models.Folders.create(doc);
    }

    public static async getFolder(selector) {
      const folder = await models.Folders.findOne(selector);

      if (!folder) {
        throw new Error('Folder not found');
      }

      return folder;
    }
  }

  folderSchema.loadClass(Folder);

  return folderSchema;
};

// =================== File ====================================
interface IFile {
  createdAt: Date;
  createdUserId: string;
  name: string;
  type: string;
  folderId?: string;
  url?: string;
  info?: object;
  contentType?: string;
  contentTypeId?: string;
  documentId?: string;

  relatedFileIds?: string[];

  permissionUserIds?: string[];
  permissionUnitId?: string;
}

export interface IFileDocument extends IFile, Document {
  _id: string;
}

const fileSchema = new Schema({
  createdAt: { type: Date, index: true },
  createdUserId: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  folderId: { type: String, index: true },
  url: { type: String },
  info: { type: Object },
  contentType: { type: String, index: true },
  contentTypeId: { type: String, index: true },
  documentId: { type: String },

  relatedFileIds: { type: [String], index: true },

  permissionUserIds: { type: [String], index: true },
  permissionUnitId: { type: String, index: true }
});

export interface IFileModel extends Model<IFileDocument> {
  saveFile({ _id, doc }: { _id?: string; doc: any }): IFileDocument;
  getFile(selector): IFileDocument;
}

export const loadFileClass = models => {
  class File {
    public static async saveFile({ _id, doc }) {
      if (_id) {
        await models.Files.update({ _id }, { $set: doc });
        return models.Files.findOne({ _id });
      }

      doc.createdAt = new Date();

      return models.Files.create(doc);
    }

    public static async getFile(selector) {
      const file = await models.Files.findOne(selector);

      if (!file) {
        throw new Error('File not found');
      }

      return file;
    }
  }

  fileSchema.loadClass(File);

  return fileSchema;
};

// =================== Log ====================================
interface ILog {
  contentType: 'folder' | 'file';
  contentTypeId?: string;
  createdAt: Date;
  userId: string;
  description: string;
}

export interface ILogDocument extends ILog, Document {
  _id: string;
}

const logSchema = new Schema({
  contentType: { type: String },
  contentTypeId: { type: String },
  createdAt: { type: Date },
  userId: { type: String },
  description: { type: String }
});

export interface ILogModel extends Model<ILogDocument> {
  createLog(doc): void;
}

export const loadLogClass = models => {
  class Log {
    public static async createLog(doc) {
      doc.createdAt = new Date();

      return models.Logs.create(doc);
    }
  }

  logSchema.loadClass(Log);

  return logSchema;
};

// =================== acknowledgement request ====================================
interface IAckRequest {
  createdAt: Date;
  fromUserId: string;
  toUserId: string;
  fileId: string;
  status: string;
  description: string;
}

export interface IAckRequestDocument extends IAckRequest, Document {
  _id: string;
}

const ackRequestSchema = new Schema({
  createdAt: { type: Date },
  fromUserId: { type: String },
  toUserId: { type: String },
  status: { type: String },
  fileId: { type: String },
  description: { type: String }
});

export interface IAckRequestModel extends Model<IAckRequestDocument> {
  createRequest(doc): void;
}

export const loadAckRequestClass = models => {
  class AckRequest {
    public static async createLog(doc) {
      doc.createdAt = new Date();

      return models.AckRequests.create(doc);
    }
  }

  ackRequestSchema.loadClass(AckRequest);

  return ackRequestSchema;
};

// =================== access request ====================================
interface IAccessRequest {
  createdAt: Date;
  fromUserId: string;
  fileId: string;
  status: string;
  description: string;
}

export interface IAccessRequestDocument extends IAccessRequest, Document {
  _id: string;
}

const accessRequestSchema = new Schema({
  createdAt: { type: Date },
  fromUserId: { type: String },
  status: { type: String },
  fileId: { type: String },
  description: { type: String }
});

export interface IAccessRequestModel extends Model<IAccessRequestDocument> {
  createRequest(doc): IAckRequestDocument;
}

export const loadAccessRequestClass = models => {
  class AccessRequest {
    public static async createLog(doc) {
      doc.createdAt = new Date();

      return models.AccessRequests.create(doc);
    }
  }

  accessRequestSchema.loadClass(AccessRequest);

  return accessRequestSchema;
};
